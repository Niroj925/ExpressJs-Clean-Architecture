export interface IndicatorOptionsMap {
  // Trend & Moving Averages
  SMA: { period?: number };
  EMA: { period?: number };
  WMA: { period?: number };
  WEMA: { period?: number };
  TRIX: { period?: number };
  VWAP: {};
  IchimokuCloud: {
    conversionPeriod?: number;
    basePeriod?: number;
    spanBPeriod?: number;
    displacement?: number;
  };

  // Momentum Indicators
  RSI: { period?: number };
  Stochastic: { kPeriod?: number; dPeriod?: number };
  StochasticRSI: { rsiPeriod?: number; kPeriod?: number; dPeriod?: number };
  WilliamsR: { period?: number };
  ROC: { period?: number };
  CCI: { period?: number };
  TRIXMomentum?: { period?: number };

  // Volatility Indicators
  ATR: { period?: number };
  BollingerBands: { period?: number; stdDev?: number };
  PSAR: { step?: number; max?: number };

  // Volume Indicators
  OBV: {};
  ADL: {};
  MFI: { period?: number };
  FI: { period?: number };
  VP: { range?: number };

  // Advanced Indicators
  ADX: { period?: number };
  MACD: {
    fastPeriod?: number;
    slowPeriod?: number;
    signalPeriod?: number;
    SimpleMAOscillator?: boolean;
    SimpleMASignal?: boolean;
  };
}
