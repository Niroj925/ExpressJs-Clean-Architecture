import { TradeSignal } from "common/enums/signal.enum";
import { CandleSignal, ISignalRule } from "core/interface/signal-rule.interface";
import { IndicatorCandle } from "core/interface/strategy.interface";

export class MacdEntrySignalRule implements ISignalRule {
  generateSignal(candles: IndicatorCandle[]): CandleSignal[] {
    return candles.map(candle => {
      const macd = candle.indicators.find(i => i.name === "MACD")?.value ?? 0;
      const signal = candle.indicators.find(i => i.name === "MACD_SIGNAL")?.value ?? 0;
      const histogram = candle.indicators.find(i => i.name === "MACD_HIST")?.value ?? 0;

      let tradeSignal = TradeSignal.HOLD;

      if (histogram > 0 && macd > signal) {
        tradeSignal = TradeSignal.BUY;
      } else if (histogram < 0 && macd < signal) {
        tradeSignal = TradeSignal.SELL;
      }

      return {
        date: candle.date,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
        signal: tradeSignal,
      };
    });
  }
}
