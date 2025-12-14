import { TradeSignal } from "common/enums/signal.enum";
import { CandleSignal } from "./signal-rule.interface";

export interface StrategyResult {
  date: string | Date;

  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;

  signal: TradeSignal;

  message?: string;
  indicators?:any
}


export interface CandleIndicator {
  name: string;     
  value: number;     
}

export interface IndicatorCandle {
  date: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  indicators: CandleIndicator[];
}



export interface IStrategy {
  execute(ticker: string): Promise<StrategyResult>;
  getName(): string;
}

export interface BacktestResult {
  candles: IndicatorCandle[];  
  signals: CandleSignal[];     
  ticker: string;
}