import { StrategyResult } from "core/interface/strategy.interface";
import { BaseStrategy } from "./base/base-strategy";
import { mergeIndicatorsByCandle } from "common/utils/merge-indicator";
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { RsiEntrySignalRule } from "framework/signal/rsi-entry.signal";

export class RsiEntryStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService, new RsiEntrySignalRule());
  }

  getName(): string {
    return "RSI Entry Strategy";
  }

  protected async executeStrategy(
    ticker: string,
    stockData: any[]
  ): Promise<StrategyResult> {

    // 1️⃣ Calculate RSI
    const rsiData = await this.calculateIndicator("RSI", stockData, {});

    // 2️⃣ Merge OHLCV + RSI into IndicatorCandle[]
    const candles = await mergeIndicatorsByCandle(stockData, [
      { name: "RSI", data: rsiData },
    ]);

    // 3️⃣ BaseStrategy handles signal generation
    return this.createResult(candles, ticker);
  }
}
