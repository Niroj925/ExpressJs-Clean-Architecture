// src/infrastructure/strategies/base/BaseStrategy.ts
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { IndicatorOptionsMap } from "common/interface/indicator.interface";
import { capitalize } from "common/utils/capitalize";
import { calculateIndicatorFromHistory } from "common/utils/getIndicatorResult";
import { IStrategy, StrategyResult } from "core/interface/strategy.interface";

export abstract class BaseStrategy implements IStrategy {
  constructor(protected readonly stockService: StockUseCaseService) {}

  abstract getName(): string;
  
  // Template method pattern
  async execute(ticker: string): Promise<StrategyResult> {
    try {
      console.log(`Executing ${this.getName()} for ${ticker}`);
      
      // Common logic - fetch stock data (shared across all strategies)
      const stockData = await this.getStockData(ticker);
      
      // Specific logic - each strategy implements this
      const result = await this.executeStrategy(ticker, stockData);
      
      return result;
    } catch (error) {
      return this.handleError(error, ticker);
    }
  }

  // Shared method for fetching stock data
  protected async getStockData(ticker: string): Promise<any> {
    return await this.stockService.getStockBySymbol(capitalize(ticker));
  }

  // Shared method for calculating indicators
  protected async calculateIndicator(
    indicatorName: keyof IndicatorOptionsMap,
    stockData: any,
    options: any = {}
  ): Promise<any> {
    return await calculateIndicatorFromHistory(
      capitalize(indicatorName) as keyof IndicatorOptionsMap,
      stockData,
      options
    );
  }

  // Abstract method - each strategy must implement its own logic
  protected abstract executeStrategy(
    ticker: string,
    stockData: any
  ): Promise<StrategyResult>;

  // Shared error handling
  protected handleError(error: unknown, ticker: string): StrategyResult {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `${this.getName()} failed for ${ticker}: ${errorMessage}`,
      timestamp: new Date(),
    };
  }

  // Helper method to generate signal based on conditions
  protected generateSignal(condition: {
    buy: boolean;
    sell: boolean;
  }): "BUY" | "SELL" | "HOLD" {
    if (condition.buy) return "BUY";
    if (condition.sell) return "SELL";
    return "HOLD";
  }

  // Helper method to create success result
  protected createSuccessResult(
    signal: "BUY" | "SELL" | "HOLD",
    data: any,
    ticker: string
  ): StrategyResult {
    return {
      success: true,
      signal,
      data: { ...data, ticker },
      message: `${this.getName()} analysis complete for ${ticker}`,
      timestamp: new Date(),
    };
  }
}