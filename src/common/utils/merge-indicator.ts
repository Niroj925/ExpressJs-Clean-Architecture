import { CandleIndicator, IndicatorCandle } from "core/interface/strategy.interface";

export async function mergeIndicatorsByCandle(
  baseData: any[],
  indicators: Array<{
    name: string;
    period?: number;
    data: any[];
  }>
): Promise<IndicatorCandle[]> {

  return baseData.map((candle): IndicatorCandle => {
    const indicatorResults: CandleIndicator[] = [];

    for (const ind of indicators) {
      // find indicator candle with same date
      const matched = ind.data.find(
        (i) => i.date === candle.date
      );

      if (matched?.indicator?.indicatorValue !== undefined) {
        indicatorResults.push({
          name: ind.name,
          value: matched.indicator.indicatorValue,
        });
      }
    }

    return {
      date: candle.date,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.ltp ?? candle.close,
      volume: candle.volume,
      indicators: indicatorResults,
    };
  });
}
