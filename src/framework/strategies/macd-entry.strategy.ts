import { StrategyResult } from "core/interface/strategy.interface";
import { BaseStrategy } from "./base/base-strategy";
import { mergeIndicatorsByCandle } from "common/utils/merge-indicator";
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { MacdEntrySignalRule } from "framework/signal/macd-entry-signal";

export class MacdEntryStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService, new MacdEntrySignalRule());
  }

  getName(): string {
    return "MACD Entry Strategy";
  }

  protected async executeStrategy(
    ticker: string,
    stockData: any[]
  ): Promise<StrategyResult> {
    // 1️⃣ Calculate MACD
    const macdResults = await this.calculateIndicator('MACD', stockData, {});
  
    // 2️⃣ Extract MACD components from the indicator structure
    const macdData = macdResults.map(item => item.indicator.indicatorValue.MACD ?? null);
    const signalData = macdResults.map(item => item.indicator.indicatorValue.signal ?? null);
    const histogramData = macdResults.map(item => item.indicator.indicatorValue.histogram ?? null);
  
    // 3️⃣ Merge OHLCV + MACD components
    const candles = await mergeIndicatorsByCandle(stockData, [
      { name: "MACD", data: macdData },              
      { name: "MACD_SIGNAL", data: signalData },     
      { name: "MACD_HIST", data: histogramData }, 
    ]);

    // 4️⃣ Delegate signal generation
    return this.createResult(candles, ticker);
  }
}