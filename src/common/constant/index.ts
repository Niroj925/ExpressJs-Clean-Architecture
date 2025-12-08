import { IndicatorOptionsMap } from "common/interface/indicator.interface";

export const INDICATOR_DEFAULTS: IndicatorOptionsMap = {
  // Trend & Moving Averages
  SMA: { period: 14 },
  EMA: { period: 14 },
  WMA: { period: 14 },
  WEMA: { period: 14 },
  TRIX: { period: 14 },
  VWAP: {},
  IchimokuCloud: {
    conversionPeriod: 9,
    basePeriod: 26,
    spanBPeriod: 52,
    displacement: 26,
  },

  // Momentum Indicators
  RSI: { period: 14 },
  Stochastic: { kPeriod: 14, dPeriod: 3 },
  StochasticRSI: { rsiPeriod: 14, kPeriod: 14, dPeriod: 3 },
  WilliamsR: { period: 14 },
  ROC: { period: 12 },
  CCI: { period: 20 },
  TRIXMomentum: { period: 14 },

  // Volatility Indicators
  ATR: { period: 14 },
  BollingerBands: { period: 20, stdDev: 2 },
  PSAR: { step: 0.02, max: 0.2 },

  // Volume Indicators
  OBV: {},
  ADL: {},
  MFI: { period: 14 },
  FI: { period: 13 },
  VP: { range: 100 },

  // Advanced Indicators
  ADX: { period: 14 },
  MACD: {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  },
};