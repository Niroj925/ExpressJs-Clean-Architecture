import { IDataServices } from "core/abstracts";
import AppException from "common/exception/app.exception";
import StockFactory from "./stock-factory-use-case.service";
import axios from "axios";
import { IConfigService } from "core/interface/config.interface";
import StockInfoModel from "core/models/stock-info.model";
import {
  CreateStockInfoDto,
  IndicatorRequestDto,
} from "presentation/dto/request/stock.dto";
import StockPriceModel from "core/models/stock-price.model";
import { capitalize } from "common/utils/capitalize";
import { calculateIndicatorFromHistory } from "common/utils/getIndicatorResult";
import { IndicatorOptionsMap } from "common/interface/indicator.interface";
import { LessThan, MoreThan } from "typeorm";
export class StockUseCaseService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly stockFactory: StockFactory,
    private readonly configService: IConfigService,
  ) {}

  async createListedStock() {
    const { data } = await axios.get(
      this.configService.get("STOCK_API_ENDPOINT"),
    );

    const stockModels: StockInfoModel[] = data.data.map((item: any) => {
      const dto: CreateStockInfoDto = {
        symbol: item.symbol,
        stockListedShares: Number(item.stock_listed_shares),
        paidUpCapital: Number(item.paid_up_capital),
        issuedCapital: Number(item.issued_capital),
        publicShares: Number(item.public_shares),
        publicPercentage: Number(item.public_percentage),
        promoterShares: Number(item.promoter_shares),
        promoterPercentage: Number(item.promoter_percentage),
        marketCapitalization: Number(item.market_capitalization),
        updatedDate: new Date(item.updated_date),
        subIndex: item.sub_index,
        fullName: item.fullname,
        latestTransactionPrice: item.latesttransactionprice,
        pointChange: item.pointchange,
        percentageChange: item.percentagechange,
        volume: item.volume,
      };
      return this.stockFactory.createStockInfo(dto);
    });

    await Promise.all(stockModels.map((stock) => this.upsertStock(stock)));

    return { message: "Stock synced successfully", total: stockModels.length };
  }

  async insertStockPrice() {
    // 1️⃣ Get total number of records
    const { data } = await axios.get("http://localhost:4000/stock/count-stock");
    const totalRecords = data.total;
    const PAGE_SIZE = 100;
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

    console.log(`Total records: ${totalRecords}, Total pages: ${totalPages}`);
    for (let page = 0; page < totalPages; page++) {
      const start = page * PAGE_SIZE;
      const end = Math.min(start + PAGE_SIZE, totalRecords); // handles last partial page

      // 2️⃣ Fetch a page of stock prices
      const { data: rows } = await axios.get(
        `http://localhost:4000/stock/pagination?start=${start}&end=${end}`,
      );
      console.log(rows);
      // 3️⃣ Convert API → DTO → Model → plain object
      const stockPriceObjects = rows.data.map((item: any) => {
        const model = this.stockFactory.createStockPrice({
          symbol: item.symbol,
          ltp: Number(item.ltp),
          ltv: Number(item.ltv),
          pointChange: Number(item.pointChange),
          percentageChange: Number(item.percentageChange),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          volume: Number(item.volume),
          date: new Date(item.date),
        });

        return { ...model }; // plain object for Postgres
      });

      // 4️⃣ Insert this page into Postgres
      //   await this.dataServices.stockPrice.createBulk(stockPriceObjects);

      console.log(
        `Inserted page ${page + 1}/${totalPages}, records: ${
          stockPriceObjects.length
        }`,
      );
    }

    return {
      message: "All stock prices inserted successfully in pages",
      totalRecords,
    };
  }

  async insertStockAfterDate() {
  const PAGE_SIZE = 100;

  try {
    const { data: latestDocs } =
      await this.dataServices.stockPrice.getAll({}, {}, { date: "DESC" }, {}, 1);

    let lastDate = new Date(latestDocs[0].date);
    let lastId: string | null = null;

    console.log("Inserting stock prices after:", lastDate);

    let totalInserted = 0;

    while (true) {
      const { data } = await axios.get(
        "http://localhost:4000/stock/stock-after-date",
        {
          params: {
            date: lastDate.toISOString(),
            lastId,
            limit: PAGE_SIZE,
          },
        },
      );

      if (!data?.length) break;

      const stockPriceObjects = data.map((item: any) =>
        this.stockFactory.createStockPrice({
          symbol: item.symbol,
          ltp: Number(item.ltp),
          ltv: Number(item.ltv),
          pointChange: Number(item.point_change),
          percentageChange: Number(item.percentage_change),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          volume: Number(item.volume),
          date: new Date(item.date),
        }),
      );

      await this.dataServices.stockPrice.createBulk(stockPriceObjects);

      const lastRecord: any = data[data.length - 1];
      lastDate = new Date(lastRecord.date);
      lastId = lastRecord.id;

      totalInserted += data.length;

      console.log(`✓ Inserted ${totalInserted} records`);
    }

    return {
      message: "Stock inserted successfully",
      totalInserted,
    };
  } catch (error) {
    console.error("Insert failed:", error);
    throw error;
  }
}

  async getAllStockInfo() {
    return await this.dataServices.stockInfo.getAllWithoutPagination();
  }

  async getAllStockPrice() {
    return await this.dataServices.stockPrice.getAll();
  }

  async getStockPriceWithPagination(page: number, limit: number) {
    return await this.dataServices.stockPrice.getAllWithCustomPagination(
      {},
      {},
      {},
      {},
      page,
      limit,
    );
  }

  async getStockByDate(date: string) {
    return await this.dataServices.stockPrice.getAllWithoutPagination({ date });
  }

  async getStockBySymbol(symbol: string) {
    // await this.dataServices.stockPrice.delete({ date:'2026-01-26' });
    const data = await this.dataServices.stockPrice.getAllWithoutPagination(
      {
        symbol: capitalize(symbol),
      },
      {},
      { date: "ASC" },
    );
    return { data, count: data.length };
  }

  async getStockPriceDays(symbol: string, days: number) {
    return await this.dataServices.stockPrice.getAllWithCustomPagination(
      { symbol: capitalize(symbol) },
      {},
      { date: "DESC" },
      {},
      1,
      days,
    );
  }

  async getUser(id: string) {
    const user = await this.dataServices.user.getOne({ id });

    if (!user) {
      console.log("user not found");
      throw new AppException({ message: "Not Found" }, "user not found", 403);
    }

    return user;
  }

  async getUsers(options: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 10 } = options;
    if (
      typeof this.dataServices.user.getAllWithCustomPagination === "function"
    ) {
      return await this.dataServices.user.getAllWithCustomPagination(
        {},
        {},
        {},
        {},
        page,
        limit,
      );
    }

    return await this.dataServices.user.getAll({}, {}, {}, undefined, limit);
  }

  async getIndicatorBasedResult(dto: IndicatorRequestDto) {
    const { data } = await this.getStockBySymbol(capitalize(dto.symbol));

    const result = await calculateIndicatorFromHistory(
      capitalize(dto.indicator) as keyof IndicatorOptionsMap,
      data,
      dto.options || {},
    );
    return result;
  }

  async deleteStockPriceBefore() {
    const cutoff = new Date("2026-01-07");

    return await this.dataServices.stockPrice.delete({
      // date: LessThan(cutoff),//before date delete
      date: MoreThan(cutoff),//after date delete
    });
  }

    async removeDuplicateStockByDate() {
      const date = new Date("2026-01-12");
    return await this.dataServices.stockPrice.getAllWithoutPagination({ date });
  }

  async upsertStock(stock: StockInfoModel) {
    const existing = await this.dataServices.stockInfo.getOneOrNull({
      symbol: stock.symbol,
    });

    return existing
      ? this.dataServices.stockInfo.update({ symbol: stock.symbol }, stock)
      : this.dataServices.stockInfo.create(stock);
  }
}
