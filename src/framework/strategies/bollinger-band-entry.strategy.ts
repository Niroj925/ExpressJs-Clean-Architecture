// src/infrastructure/strategies/BollingerEntryStrategy.ts
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { StrategyResult } from "core/interface/strategy.interface";
import { BaseStrategy } from "./base/base-strategy";

export class BollingerEntryStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService);
  }

  getName(): string {
    return "Bollinger Bands Entry Strategy";
  }

  protected async executeStrategy(
    ticker: string,
    stockData: any
  ): Promise<StrategyResult> {
    // Calculate Bollinger Bands
    const bollingerData = await this.calculateIndicator('BollingerBands', stockData, {
      period: 20,
      stdDev: 2,
    });

    const upperBand = bollingerData?.upper || [];
    const middleBand = bollingerData?.middle || [];
    const lowerBand = bollingerData?.lower || [];

    // Get latest price and bands
    const latestPrice = stockData.close[stockData.close.length - 1];
    const latestUpper = upperBand[upperBand.length - 1];
    const latestLower = lowerBand[lowerBand.length - 1];
    const latestMiddle = middleBand[middleBand.length - 1];

    // Generate signal
    const signal = this.generateSignal({
      buy: latestPrice <= latestLower, // Price touches or breaks lower band
      sell: latestPrice >= latestUpper, // Price touches or breaks upper band
    });

    return this.createSuccessResult(
      signal,
      {
        latestPrice,
        latestUpper,
        latestMiddle,
        latestLower,
        upperBand,
        middleBand,
        lowerBand,
      },
      ticker
    );
  }
}