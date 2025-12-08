import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsObject } from "class-validator";
import { IndicatorOptionsMap } from "common/interface/indicator.interface";

export class CreateStockInfoDto {
  @IsString()
  symbol: string;

  @IsString()
  stockListedShares: number;

  @IsString()
  paidUpCapital: number;

  @IsString()
  issuedCapital: number;

  @IsString()
  publicShares: number;

  @IsString()
  publicPercentage: number;

  @IsString()
  promoterShares: number;

  @IsString()
  promoterPercentage: number;

  @IsString()
  marketCapitalization: number;

  @IsDateString()
  updatedDate: Date;

  @IsOptional()
  @IsString()
  subIndex?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNumber()
  latestTransactionPrice: number;

  @IsOptional()
  @IsNumber()
  pointChange?: number;

  @IsOptional()
  @IsNumber()
  percentageChange?: number;

  @IsOptional()
  @IsNumber()
  volume?: number;
}

export class CreateStockPriceDto {
  @IsString()
  symbol: string;

  @IsNumber()
  ltp: number;

  @IsNumber()
  ltv: number;

  @IsOptional()
  @IsNumber()
  pointChange?: number;

  @IsOptional()
  @IsNumber()
  percentageChange?: number;

  @IsNumber()
  open: number;

  @IsNumber()
  high: number;

  @IsNumber()
  low: number;

  @IsNumber()
  volume: number;

  @IsDateString()
  date: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     IndicatorRequestDto:
 *       type: object
 *       required:
 *         - symbol
 *         - indicator
 *       properties:
 *         symbol:
 *           type: string
 *           description: Stock symbol (e.g. SPDL, BTCUSDT, AAPL)
 *           example: "SPDL"
 *         indicator:
 *           type: string
 *           description: Name of technical indicator
 *           enum:
 *             - SMA
 *             - EMA
 *             - WMA
 *             - WEMA
 *             - TRIX
 *             - VWAP
 *             - IchimokuCloud
 *             - RSI
 *             - Stochastic
 *             - StochasticRSI
 *             - WilliamsR
 *             - ROC
 *             - CCI
 *             - ATR
 *             - BollingerBands
 *             - PSAR
 *             - OBV
 *             - ADL
 *             - MFI
 *             - FI
 *             - VP
 *             - ADX
 *             - MACD
 *           example: "RSI"
 *         options:
 *           type: object
 *           description: Indicator configuration options (optional)
 *           example:
 *             period: 14
 *             stdDev: 2
 *           additionalProperties: true
 */
export class IndicatorRequestDto {
  
  @IsString()
  symbol: string;

  @IsEnum([
    "SMA","EMA","WMA","WEMA","TRIX","VWAP","IchimokuCloud","RSI","Stochastic",
    "StochasticRSI","WilliamsR","ROC","CCI","ATR","BollingerBands","PSAR","OBV",
    "ADL","MFI","FI","VP","ADX","MACD"
  ] as const)
  indicator: keyof IndicatorOptionsMap;

  @IsOptional()
  @IsObject()
  options?: Partial<IndicatorOptionsMap[keyof IndicatorOptionsMap]>;
}
