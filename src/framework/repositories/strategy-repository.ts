import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { StrategyToken, StrategyTokenType } from "common/constant/strategy-key.constant";
import { IStrategy } from "core/interface/strategy.interface";
import { IStrategyRepository } from "core/repository/strategy.repository";
import { RsiEntrySignalRule } from "framework/signal/rsi-entry.signal";
import { BollingerEntryStrategy, MacdEntryStrategy, RsiEntryStrategy } from "framework/strategies";
import { RsiEmaStrategy } from "framework/strategies/rsi-ema.strategy";

export class StrategyRepository implements IStrategyRepository {

  private strategies: Record<StrategyTokenType, IStrategy>;

  constructor(private readonly stockService: StockUseCaseService) {
    this.strategies = {
      [StrategyToken.RSI_ENTRY]: new RsiEntryStrategy(this.stockService),
      [StrategyToken.MACD_ENTRY]: new MacdEntryStrategy(this.stockService),
      [StrategyToken.BOLLINGER_ENTRY]: new BollingerEntryStrategy(this.stockService),
      // [StrategyToken.EMA_CROSSOVER]: new EmaCrossoverStrategy(this.stockService),
      [StrategyToken.RSI_EMA]: new RsiEmaStrategy(this.stockService),
    };
  }

  getStrategy(token: StrategyTokenType): IStrategy {
    return this.strategies[token];
  }
}
