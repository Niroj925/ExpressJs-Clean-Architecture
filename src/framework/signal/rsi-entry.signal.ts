import { TradeSignal } from "common/enums/signal.enum";
import { CandleSignal, ISignalRule } from "core/interface/signal-rule.interface";
import { IndicatorCandle } from "core/interface/strategy.interface";

export class RsiEntrySignalRule implements ISignalRule {
  generateSignal(candles: IndicatorCandle[]): CandleSignal[] {
    return candles.map(candle => {
      const rsi =
        candle.indicators.find(i => i.name === "RSI")?.value ?? 50;

      let signal = TradeSignal.HOLD;

      if (rsi < 30) signal = TradeSignal.BUY;
      else if (rsi > 70) signal = TradeSignal.SELL;

      return {
        date: candle.date,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
        signal,
      };
    });
  }
}
