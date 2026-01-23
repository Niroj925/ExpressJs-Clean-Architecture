import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { BaseStrategy } from "./base/base-strategy";
import { RsiEmaSignalRule } from "framework/signal/rsi-ema.signal";
import { StrategyResult } from "core/interface/strategy.interface";
import { mergeIndicatorsByCandle } from "common/utils/merge-indicator";

export class RsiEmaStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService, new RsiEmaSignalRule());
  }

  getName(): string {
    return "RSI + EMA Strategy";
  }

  protected async executeStrategy(
    ticker: string,
    stockData: any[],
  ): Promise<StrategyResult> {
    const rsiData = await this.calculateIndicator("RSI", stockData, {
      period: 14,
    });
    const emaData = await this.calculateIndicator("EMA", stockData, {
      period: 50,
    });

    const candles = await mergeIndicatorsByCandle(stockData, [
      { name: "RSI", period: 14, data: rsiData },
      { name: "EMA", period: 50, data: emaData },
    ]);
    return this.createResult(candles, ticker);
  }
}
