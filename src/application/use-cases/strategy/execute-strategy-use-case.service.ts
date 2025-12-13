// src/application/use-cases/ExecuteStrategyUseCase.ts

import { StrategyTokenType } from "common/constant/strategy-key.constant";
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
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      };
    }
  }
}