
import StockInfoModel from "core/models/stock-info.model";
import StockPriceModel from "core/models/stock-price.model";
import { CreateStockInfoDto, CreateStockPriceDto } from "presentation/dto/request/stock.dto";

export class StockFactory {
  createStockInfo(dto: CreateStockInfoDto) {
    const model = new StockInfoModel();

    if (dto.symbol !== undefined) model.symbol = dto.symbol;
    if (dto.stockListedShares !== undefined) model.stockListedShares = dto.stockListedShares;
    if (dto.paidUpCapital !== undefined) model.paidUpCapital = dto.paidUpCapital;
    if (dto.issuedCapital !== undefined) model.issuedCapital = dto.issuedCapital;
    if (dto.publicShares !== undefined) model.publicShares = dto.publicShares;
    if (dto.publicPercentage !== undefined) model.publicPercentage = dto.publicPercentage;
    if (dto.promoterShares !== undefined) model.promoterShares = dto.promoterShares;
    if (dto.promoterPercentage !== undefined) model.promoterPercentage = dto.promoterPercentage;
    if (dto.marketCapitalization !== undefined) model.marketCapitalization = dto.marketCapitalization;
    if (dto.updatedDate !== undefined) model.updatedDate = dto.updatedDate;
    if (dto.subIndex !== undefined) model.subIndex = dto.subIndex;
    if (dto.fullName !== undefined) model.fullName = dto.fullName;
    if (dto.latestTransactionPrice !== undefined) model.latestTransactionPrice = dto.latestTransactionPrice;
    if (dto.pointChange !== undefined) model.pointChange = dto.pointChange;
    if (dto.percentageChange !== undefined) model.percentageChange = dto.percentageChange;
    if (dto.volume !== undefined) model.volume = dto.volume;

    return model;
  }

    createStockPrice(dto: CreateStockPriceDto) {
    const model = new StockPriceModel();

    if (dto.symbol !== undefined) model.symbol = dto.symbol;
    if (dto.ltp !== undefined) model.ltp = dto.ltp;
    if (dto.ltv !== undefined) model.ltv = dto.ltv;
    if (dto.pointChange !== undefined) model.pointChange = dto.pointChange;
    if (dto.percentageChange !== undefined) model.percentageChange = dto.percentageChange;
    if (dto.open !== undefined) model.open = dto.open;
    if (dto.high !== undefined) model.high = dto.high;
    if (dto.low !== undefined) model.low = dto.low;
    if (dto.volume !== undefined) model.volume = dto.volume;
    if (dto.date !== undefined) model.date = dto.date;

    return model;
  }
}

export default StockFactory;
