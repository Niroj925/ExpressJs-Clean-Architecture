import { BaseModel } from "./base";

export class StockInfoModel extends BaseModel {
  symbol: string;
  stockListedShares: number;
  paidUpCapital: number;
  issuedCapital: number;
  publicShares: number;
  publicPercentage: number;
  promoterShares: number;
  promoterPercentage: number;
  marketCapitalization: number;
  updatedDate: Date;
  subIndex?: string;
  fullName?: string;
  latestTransactionPrice: number;
  pointChange?: number;
  percentageChange?: number;
  volume?: number;
}

export default StockInfoModel;
