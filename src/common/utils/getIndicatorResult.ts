import * as ti from "technicalindicators";
import StockPriceModel from "core/models/stock-price.model";
import { IndicatorOptionsMap } from "common/interface/indicator.interface";
import { INDICATOR_DEFAULTS } from "common/constant";

export async function calculateIndicatorFromHistory<
  I extends keyof IndicatorOptionsMap
>(
  indicatorName: I,
  data: StockPriceModel[],
  options?: IndicatorOptionsMap[I]
): Promise<
  Array<{
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    indicator: any;
  }>
> {
  const priceHistory = {
    open: data.map(d => d.open),
    high: data.map(d => d.high),
    low: data.map(d => d.low),
    close: data.map(d => d.ltp),
    volume: data.map(d => d.volume),
  };

  const Indicator = (ti as any)[indicatorName];
  if (!Indicator) {
    throw new Error(`Indicator '${indicatorName}' not found`);
  }

  const defaultOptions = INDICATOR_DEFAULTS[indicatorName];
  const mergedOptions = { ...defaultOptions, ...options };

  const input: Record<string, any> = { ...mergedOptions };

  if (
    "values" in Indicator.prototype ||
    ["RSI", "SMA", "EMA"].includes(indicatorName)
  ) {
    input.values = priceHistory.close;
  }

  if (["BollingerBands", "ATR", "ADX", "Stochastic", "MACD"].includes(indicatorName)) {
    Object.assign(input, priceHistory);
  }

  const indicatorValues = Indicator.calculate(input);

  const offset = data.length - indicatorValues.length;

  const result = indicatorValues.map((indicatorValue: any, index: number) => {
    const candle = data[index + offset];

    return {
      date: candle.date,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.ltp,
      volume: candle.volume,
      indicator: {
        indicatorName,
        indicatorValue
      }
    };
  });

  return result;
}
