import { StrategyResult } from "core/interface/strategy.interface";
import { BaseStrategy } from "./base/base-strategy";
import { mergeIndicatorsByCandle } from "common/utils/merge-indicator";
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { BollingerEntrySignalRule } from "framework/signal/bolinger.signal";

export class BollingerEntryStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService, new BollingerEntrySignalRule());
  }

  getName(): string {
    return "Bollinger Bands Entry Strategy";
  }

  protected async executeStrategy(
    ticker: string,
    stockData: any[]
  ): Promise<StrategyResult> {
    // 1️⃣ Calculate Bollinger Bands
    const bbResults = await this.calculateIndicator(
      "BollingerBands",
      stockData,
      { period: 20, stdDev: 2 }
    );

    // 2️⃣ Extract Bollinger Bands components from the indicator structure
    const upperData = bbResults.map(
      (item) => item.indicator.indicatorValue.upper ?? null
    );
    const middleData = bbResults.map(
      (item) => item.indicator.indicatorValue.middle ?? null
    );
    const lowerData = bbResults.map(
      (item) => item.indicator.indicatorValue.lower ?? null
    );

    // 3️⃣ Merge OHLCV + Bollinger Bands
    const candles = await mergeIndicatorsByCandle(stockData, [
      { name: "BB_UPPER", data: upperData },
      { name: "BB_MIDDLE", data: middleData },
      { name: "BB_LOWER", data: lowerData },
    ]);

    // 3️⃣ Delegate signal generation
    return this.createResult(candles, ticker);
  }
}
