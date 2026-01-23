import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { validateOrReject } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CoreApiResponse } from "presentation/api/core-api-response";
import { IndicatorRequestDto } from "presentation/dto/request/stock.dto";

export class StockController {
  constructor(private readonly stockService: StockUseCaseService) {}

  async createListedStock(req: Request, res: Response, next: NextFunction) {
    try {
      const stock = await this.stockService.createListedStock();
      return res
        .status(201)
        .json(
          CoreApiResponse.success(
            stock,
            201,
            "listed stock created successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async getAllStockInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const stock = await this.stockService.getAllStockInfo();
      return res
        .status(201)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "listed stock created successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async getAllStockPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const stock = await this.stockService.getAllStockPrice();

      return res
        .status(200)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "All stock prices fetched successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async getStockPriceWithPagination(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const stock = await this.stockService.getStockPriceWithPagination(
        page,
        limit,
      );

      return res
        .status(200)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "Paginated stock prices fetched successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async getStockByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;

      if (!date) {
        return res
          .status(400)
          .json(CoreApiResponse.error(400, "Date is required"));
      }

      const stock = await this.stockService.getStockByDate(String(date));

      return res
        .status(200)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "Stock prices fetched by date successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async getStockBySymbol(req: Request, res: Response, next: NextFunction) {
    try {
      const symbol = String(req.params.symbol || req.query.symbol);

      if (!symbol) {
        return res
          .status(400)
          .json(CoreApiResponse.error(400, "Symbol is required"));
      }

      const stock = await this.stockService.getStockBySymbol(symbol);

      return res
        .status(200)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "Stock price fetched by symbol successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async getStockPriceDays(req: Request, res: Response, next: NextFunction) {
    try {
      const symbol = String(req.query.symbol);
      const days = Number(req.query.days) || 7;

      if (!symbol) {
        return res
          .status(400)
          .json(CoreApiResponse.error(400, "Symbol is required"));
      }

      const stock = await this.stockService.getStockPriceDays(symbol, days);

      return res
        .status(200)
        .json(
          CoreApiResponse.success(stock, 200, `Latest ${days} days fetched`),
        );
    } catch (err) {
      return next(err);
    }
  }

  async getIndicatorBasedResult(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = Object.assign(new IndicatorRequestDto(), req.body);
      // await validateOrReject(dto);

      const stock = await this.stockService.getIndicatorBasedResult(dto);

      return res
        .status(200)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            `Indicator based result fetched successfully`,
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async insertStockPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const stock = await this.stockService.insertStockPrice();
      return res
        .status(201)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "stock price inserted successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async insertStockAfterDate(req: Request, res: Response, next: NextFunction) {
    try {
      const date = String(req.query.date);
      const start = String(req.query?.start);
      const end = String(req.query?.end);
      const stock = await this.stockService.insertStockAfterDate(date,start,end);
      return res
        .status(201)
        .json(
          CoreApiResponse.success(
            stock,
            200,
            "stock price after date inserted successfully",
          ),
        );
    } catch (err) {
      return next(err);
    }
  }

  async deleteOldStockPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.stockService.deleteStockPriceBefore();

      return res
        .status(200)
        .json(
          CoreApiResponse.success(result, 200, `Deleted stock price older`),
        );
    } catch (err) {
      next(err);
    }
  }
}
