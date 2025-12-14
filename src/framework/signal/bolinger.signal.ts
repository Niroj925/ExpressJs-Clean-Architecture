import { TradeSignal } from "common/enums/signal.enum";
import { CandleSignal, ISignalRule } from "core/interface/signal-rule.interface";
import { IndicatorCandle } from "core/interface/strategy.interface";

export class BollingerEntrySignalRule implements ISignalRule {
  generateSignal(candles: IndicatorCandle[]): CandleSignal[] {
    return candles.map(candle => {
      const upper =
        candle.indicators.find(i => i.name === "BB_UPPER")?.value ?? 0;
      const middle =
        candle.indicators.find(i => i.name === "BB_MIDDLE")?.value ?? 0;
      const lower =
        candle.indicators.find(i => i.name === "BB_LOWER")?.value ?? 0;

      let signal = TradeSignal.HOLD;

      if (candle.close <= lower) {
        signal = TradeSignal.BUY;
      } else if (candle.close >= upper) {
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
      };
    });
  }
}
