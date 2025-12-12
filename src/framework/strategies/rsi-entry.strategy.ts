// src/infrastructure/strategies/RsiEntryStrategy.ts

import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { IndicatorOptionsMap } from "common/interface/indicator.interface";
import { capitalize } from "common/utils/capitalize";
import { calculateIndicatorFromHistory } from "common/utils/getIndicatorResult";
import { IStrategy, StrategyResult } from "core/interface/strategy.interface";

export class RsiEntryStrategy implements IStrategy {
  constructor(private readonly stockService: StockUseCaseService) {}

  getName(): string {
    return "RSI Entry Strategy";
  }

  async execute(ticker: string): Promise<StrategyResult> {
    try {
      // Your RSI logic here - all data fetching and processing happens inside
      console.log(`Executing RSI strategy for ${ticker}`);
      const data = await this.stockService.getStockBySymbol(capitalize(ticker));

      const response = await calculateIndicatorFromHistory(
        capitalize("RSI") as keyof IndicatorOptionsMap,
        data,
        {}
      );

      let signal: "BUY" | "SELL" | "HOLD" = "HOLD";
      const result = response?.filter((item: number) => item < 30);
      return {
        success: true,
        signal,
        data: { result, ticker },
        message: `RSI analysis complete for ${ticker}`,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: `RSI strategy failed: ${error}`,
        timestamp: new Date(),
      };
    }
  }
}
