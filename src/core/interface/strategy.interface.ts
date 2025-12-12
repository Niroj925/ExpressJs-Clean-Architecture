// src/domain/entities/StrategyResult.ts
export interface StrategyResult {
  success: boolean;
  signal?: "BUY" | "SELL" | "HOLD";
  data?: any;
  message?: string;
  timestamp: Date;
}

// // src/domain/interfaces/IStrategy.ts
// import { StrategyResult } from "../entities/StrategyResult";

export interface IStrategy {
  execute(ticker: string): Promise<StrategyResult>;
  getName(): string;
}