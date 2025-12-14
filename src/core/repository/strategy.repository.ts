
import { StrategyTokenType } from "common/constant/strategy-key.constant";
import { IStrategy } from "core/interface/strategy.interface";

export interface IStrategyRepository {
  getStrategy(token: StrategyTokenType): IStrategy;
  // registerStrategy(token: StrategyTokenType, strategy: IStrategy): void;
}

