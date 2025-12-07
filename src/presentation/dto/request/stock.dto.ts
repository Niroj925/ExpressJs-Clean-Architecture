import { IsString, IsNumber, IsOptional, IsDateString } from "class-validator";

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
