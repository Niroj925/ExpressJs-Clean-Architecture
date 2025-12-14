import { StrategyTokenType } from "common/constant/strategy-key.constant";
import { TradeSignal } from "common/enums/signal.enum";
import { StrategyResult } from "core/interface/strategy.interface";
import { IStrategyRepository } from "core/repository/strategy.repository";

export class ExecuteStrategyUseCase {
  constructor(private strategyRepository: IStrategyRepository) {}

  async execute(
    strategyToken: StrategyTokenType,
    ticker: string
  ): Promise<StrategyResult> {
    try {
      const strategy = this.strategyRepository.getStrategy(strategyToken);
      return await strategy.execute(ticker);
    } catch (error) {
      // Return a valid StrategyResult even in case of error
      return {
        date: new Date(),
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
        signal: TradeSignal.HOLD,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
