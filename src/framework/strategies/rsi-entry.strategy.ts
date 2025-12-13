// src/infrastructure/strategies/RsiEntryStrategy.ts
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { StrategyResult } from "core/interface/strategy.interface";
import { BaseStrategy } from "./base/base-strategy";

export class RsiEntryStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService);
  }

  getName(): string {
    return "RSI Entry Strategy";
  }

  protected async executeStrategy(
    ticker: string,
    stockData: any
  ): Promise<StrategyResult> {
    // Calculate RSI indicator
    const rsiValues = await this.calculateIndicator("RSI", stockData, {});

    // Filter RSI values below 30 (oversold)
    const oversoldValues = rsiValues?.filter((value: number) => value < 30) || [];
    const overboughtValues = rsiValues?.filter((value: number) => value > 70) || [];
    
    // Get latest RSI value
    const latestRsi = rsiValues?.[rsiValues.length - 1] || 50;
    // const latestRsi = 76;

    // Generate signal
    const signal = this.generateSignal({
      buy: latestRsi < 30,
      sell: latestRsi > 70,
    });

    return this.createSuccessResult(
      signal,
      {
        latestRsi,
        oversoldValues,
        overboughtValues,
        allRsiValues: rsiValues,
      },
      ticker
    );
  }
}