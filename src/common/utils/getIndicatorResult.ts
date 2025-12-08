import * as ti from "technicalindicators";
import StockPriceModel from "core/models/stock-price.model";
import { IndicatorOptionsMap } from "common/interface/indicator.interface";
import { INDICATOR_DEFAULTS } from "common/constant";

export async function calculateIndicatorFromHistory<
  I extends keyof IndicatorOptionsMap
>(
  indicatorName: I,
  data: StockPriceModel[],
  options?: IndicatorOptionsMap[I] // Made optional
): Promise<any> {

  // 1️⃣ Prepare OHLC arrays
  const priceHistory = {
    open: data.map(d => d.open),
    high: data.map(d => d.high),
    low: data.map(d => d.low),
    close: data.map(d => d.ltp),
    volume: data.map(d => d.volume)
  };

  // 2️⃣ Find indicator class dynamically
  const Indicator = (ti as any)[indicatorName];
  if (!Indicator) throw new Error(`Indicator '${indicatorName}' not found`);

  // 3️⃣ Merge user options with defaults
  const defaultOptions = INDICATOR_DEFAULTS[indicatorName];
  const mergedOptions = { ...defaultOptions, ...options };

  // 4️⃣ Build input
  const input: Record<string, any> = { ...mergedOptions };

  // Map "values" automatically for indicators that need it
  if ("values" in (ti as any)[indicatorName].prototype || 
      indicatorName === "RSI" || 
      indicatorName === "SMA" || 
      indicatorName === "EMA") {
    input.values = priceHistory.close;
  }

  // Add OHLC data for indicators that need it
  if (["BollingerBands", "ATR", "ADX", "Stochastic", "MACD"].includes(indicatorName)) {
    Object.assign(input, priceHistory);
  }

  // 5️⃣ Calculate
  let result = Indicator.calculate(input);

  return result;
}