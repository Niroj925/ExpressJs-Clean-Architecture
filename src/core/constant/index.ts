// src/domain/enums/StrategyToken.ts
export const StrategyToken = {
  RSI_ENTRY: "RSI_ENTRY",
  MACD_ENTRY: "MACD_ENTRY",
  BOLLINGER_ENTRY: "BOLLINGER_ENTRY",
  EMA_CROSSOVER: "EMA_CROSSOVER",
} as const;

export type StrategyTokenType = typeof StrategyToken[keyof typeof StrategyToken];