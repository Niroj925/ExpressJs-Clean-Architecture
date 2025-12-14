import { TradeSignal } from "common/enums/signal.enum";
import { IndicatorCandle } from "./strategy.interface";


export interface CandleSignal {
  date: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  signal: TradeSignal;
}

export interface ISignalRule {
  generateSignal(candles: IndicatorCandle[]): CandleSignal[];
}
