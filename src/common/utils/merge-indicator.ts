// import { CandleIndicator, IndicatorCandle } from "core/interface/strategy.interface";

// export async function mergeIndicatorsByCandle(
//   baseData: any[],
//   indicators: Array<{
//     name: string;
//     period?: number;
//     data: any[];
//   }>
// ): Promise<IndicatorCandle[]> {
//   return baseData.map((candle, index): IndicatorCandle => ({
//     date: candle.date,
//     open: candle.open,
//     high: candle.high,
//     low: candle.low,
//     close: candle.ltp ?? candle.close,
//     volume: candle.volume,
//     indicators: indicators
//       .map((ind): CandleIndicator | null => {
//         const indicatorObj = ind.data[index]?.indicator;
//         if (!indicatorObj) return null;

//         return {
//           name: ind.name,
//           value: indicatorObj.indicatorValue,
//         };
//       })
//       .filter(
//         (i): i is CandleIndicator => i !== null
//       ),
//   }));
// }

import { CandleIndicator, IndicatorCandle } from "core/interface/strategy.interface";

export async function mergeIndicatorsByCandle(
  baseData: any[],
  indicators: Array<{
    name: string;
    period?: number;
    data: any[];
  }>
): Promise<IndicatorCandle[]> {
  return baseData.map((candle, index): IndicatorCandle => {
    return {
      date: candle.date,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.ltp ?? candle.close,
      volume: candle.volume,
      indicators: indicators.map((ind): CandleIndicator => {
        // Get the corresponding indicator data for this index
        const indicatorDataPoint = ind.data[index];
        
        // Only use the value if it exists in the indicator data at this index
        const value = indicatorDataPoint?.indicator?.indicatorValue ?? null;
        
        return {
          name: ind.name,
          value: value,
        };
      }),
    };
  });
}