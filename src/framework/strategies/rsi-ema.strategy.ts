import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { BaseStrategy } from "./base/base-strategy";
import { RsiEmaSignalRule } from "framework/signal/rsi-ema.signal";
import { StrategyResult } from "core/interface/strategy.interface";
import { mergeIndicatorsByCandle } from "common/utils/merge-indicator";

export class RsiEmaStrategy extends BaseStrategy {
  constructor(stockService: StockUseCaseService) {
    super(stockService, new RsiEmaSignalRule());
  }

  getName(): string {
    return "RSI + EMA Strategy";
  }

  // protected async executeStrategy(
  //   ticker: string,
  //   stockData: any[]
  // ): Promise<StrategyResult> {
  //   const rsiData = await this.calculateIndicator("RSI", stockData, {});
  //   const emaData = await this.calculateIndicator("EMA", stockData, { period: 50 });
  //  console.log('total stock:',stockData.length);
  //  console.log('total rsi:',rsiData.length);
  //  console.log('total ema:',emaData.length);

  //   const candles = await mergeIndicatorsByCandle(stockData, [
  //     { name: "RSI", data: rsiData },
  //     { name: "EMA", period: 50, data: emaData },
  //   ]);


  //   return this.createResult(candles, ticker);
  // }

    protected async executeStrategy(
    ticker: string,
    stockData: any[]
  ){
    const rsiData = await this.calculateIndicator("RSI", stockData, { period: 14 });
  const emaData = await this.calculateIndicator("EMA", stockData, { period: 50 });

  console.log("Total stock candles:", stockData.length); // 207
  console.log("RSI data length:", rsiData.length); // 207 (includes nulls)
  console.log("EMA data length:", emaData.length); // 207 (includes nulls)
  
  // Merge indicators by candle
  const candles = await mergeIndicatorsByCandle(stockData, [
    { name: "RSI", period: 14, data: rsiData },
    { name: "EMA", period: 50, data: emaData },
  ]);
console.log(candles)
  // First 13 candles: RSI = null, EMA = null
  // Candles 14-49: RSI = calculated, EMA = null
  // Candles 50+: Both calculated
  
  console.log("First candle RSI:", candles[0].indicators.find(i => i.name === "RSI")?.value); // null
  console.log("14th candle RSI:", candles[13].indicators.find(i => i.name === "RSI")?.value); // number
  console.log("First candle EMA:", candles[0].indicators.find(i => i.name === "EMA")?.value); // null
  console.log("50th candle EMA:", candles[49].indicators.find(i => i.name === "EMA")?.value); // number
  console.log("Last candle RSI:", candles[206].indicators.find(i => i.name === "RSI")?.value); // number
  console.log("Last candle EMA:", candles[206].indicators.find(i => i.name === "EMA")?.value); // number


    return this.createResult(candles, ticker);
  }
}