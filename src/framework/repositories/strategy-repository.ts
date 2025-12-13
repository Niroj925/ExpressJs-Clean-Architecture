// src/infrastructure/repositories/StrategyRepository.ts
import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { StrategyToken, StrategyTokenType } from "common/constant/strategy-key.constant";
import { IStrategy } from "core/interface/strategy.interface";
import { IStrategyRepository } from "core/repository/strategy.repository";
import { BollingerEntryStrategy, MacdEntryStrategy, RsiEntryStrategy } from "framework/strategies";

export class StrategyRepository implements IStrategyRepository {
  private strategies: Map<StrategyTokenType, IStrategy>;

  constructor(private readonly stockService: StockUseCaseService) {
    this.strategies = new Map();
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    // Register all strategies with stockService dependency
    this.registerStrategy(
      StrategyToken.RSI_ENTRY,
      new RsiEntryStrategy(this.stockService)
    );
    this.registerStrategy(
      StrategyToken.MACD_ENTRY,
      new MacdEntryStrategy(this.stockService)
    );
    this.registerStrategy(
      StrategyToken.BOLLINGER_ENTRY,
      new BollingerEntryStrategy(this.stockService)
    );
    // Add more strategies as needed
  }

  registerStrategy(token: StrategyTokenType, strategy: IStrategy): void {
    this.strategies.set(token, strategy);
  }

  getStrategy(token: StrategyTokenType): IStrategy {
    const strategy = this.strategies.get(token);
    if (!strategy) {
      throw new Error(`Strategy not found for token: ${token}`);
    }
    return strategy;
  }
}