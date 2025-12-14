import { TradeSignal } from "common/enums/signal.enum";
import { CandleSignal, ISignalRule } from "core/interface/signal-rule.interface";
import { IndicatorCandle } from "core/interface/strategy.interface";

export class RsiEmaSignalRule implements ISignalRule {
  generateSignal(candles: IndicatorCandle[]): CandleSignal[] {
    return candles.map(candle => {
      const rsi =
        candle.indicators.find(i => i.name === "RSI")?.value ?? 50;

      const ema =
        candle.indicators.find(i => i.name === "EMA")?.value ?? 0;

      let signal: TradeSignal = TradeSignal.HOLD;

      if (rsi < 30 && candle.close > ema) {
        signal = TradeSignal.BUY;
      } else if (rsi > 70 && candle.close < ema) {
        signal = TradeSignal.SELL;
      }

      return {
        date: candle.date,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
        signal,
        indcators:candle?.indicators
      };
    });
  }


}
