// src/infrastructure/strategies/MacdEntryStrategy.ts
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { StrategyResult } from "core/interface/strategy.interface";
import { BaseStrategy } from "./base/base-strategy";

export class MacdEntryStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService);
  }

  getName(): string {
    return "MACD Entry Strategy";
  }

  protected async executeStrategy(
    ticker: string,
    stockData: any
  ): Promise<StrategyResult> {
    // Calculate MACD indicator
    const macdData = await this.calculateIndicator("MACD", stockData, {});

    // Extract MACD components (adjust based on your calculateIndicator response)
    const macdLine = macdData?.MACD || [];
    const signalLine = macdData?.signal || [];
    const histogram = macdData?.histogram || [];

    // Get latest values
    const latestMacd = macdLine[macdLine.length - 1] || 0;
    const latestSignal = signalLine[signalLine.length - 1] || 0;
    const latestHistogram = histogram[histogram.length - 1] || 0;

    // Generate signal based on MACD crossover
    const signal = this.generateSignal({
      buy: latestHistogram > 0 && latestMacd > latestSignal,
      sell: latestHistogram < 0 && latestMacd < latestSignal,
    });

    return this.createSuccessResult(
      signal,
      {
        latestMacd,
        latestSignal,
        latestHistogram,
        macdLine,
        signalLine,
        histogram,
      },
      ticker
    );
  }
}