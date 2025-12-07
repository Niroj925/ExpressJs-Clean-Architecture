import { BaseModel } from "./base";

export class StockPriceModel extends BaseModel {
  symbol: string;
  ltp: number;
  ltv: number;
  pointChange?: number;
  percentageChange?: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  date: Date;
}

export default StockPriceModel;
