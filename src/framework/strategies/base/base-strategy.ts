import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";
import { TradeSignal } from "common/enums/signal.enum";
import AppException from "common/exception/app.exception";
import { IndicatorOptionsMap } from "common/interface/indicator.interface";
import { capitalize } from "common/utils/capitalize";
import { calculateIndicatorFromHistory } from "common/utils/getIndicatorResult";
import { ISignalRule } from "core/interface/signal-rule.interface";
import {
  IndicatorCandle,
  IStrategy,
  StrategyResult,
} from "core/interface/strategy.interface";

export abstract class BaseStrategy implements IStrategy {
  constructor(
    protected readonly stockService: StockUseCaseService,
    protected readonly signalRule: ISignalRule
  ) {}

  abstract getName(): string;

  async execute(ticker: string): Promise<StrategyResult> {
    try {
      const stockData = await this.getStockData(ticker);
      return await this.executeStrategy(ticker, stockData);
    } catch (error) {
      return this.handleError(error, ticker);
    }
  }

  protected async getStockData(ticker: string): Promise<any[]> {
    const { data } = await this.stockService.getStockBySymbol(capitalize(ticker));
    return data;
  }

  protected async calculateIndicator(
    indicatorName: keyof IndicatorOptionsMap,
    stockData: any,
    options: any = {}
  ) {
    return calculateIndicatorFromHistory(
      capitalize(indicatorName) as keyof IndicatorOptionsMap,
      stockData,
      options
    );
  }

  protected abstract executeStrategy(
    ticker: string,
    stockData: any[]
  ): Promise<StrategyResult>;

  protected handleError(error: unknown, ticker: string): StrategyResult {
    return {
      date: new Date(),
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0,
      signal: TradeSignal.HOLD,
      message: `${this.getName()} failed for ${ticker}`,
    };
  }

  /**
   * 🔥 Create final strategy result (LATEST candle only)
   */
  protected createResult(
    candles: IndicatorCandle[],
    ticker: string
  ): any {
    return candles
    const signals = this.signalRule.generateSignal(candles);

    return signals
    // only BUY / SELL signals
    const tradeSignals = signals.filter(
      (s) => s.signal === TradeSignal.BUY || s.signal === TradeSignal.SELL
    );

    return tradeSignals

    const latestTradeSignal = tradeSignals.at(-1);

 console.log(latestTradeSignal)
 const latestTradeSignalInfo= candles.find((item)=>item.date==latestTradeSignal?.date)

    return {
      date: latestTradeSignalInfo?.date!,
      open: latestTradeSignalInfo?.open!,
      high: latestTradeSignalInfo?.high!,
      low: latestTradeSignalInfo?.low!,
      close: latestTradeSignalInfo?.close!,
      volume: latestTradeSignalInfo?.volume!,
      signal: latestTradeSignal?.signal!,
      message: `${this.getName()} analysis complete for ${ticker}`,
      indicators: latestTradeSignalInfo?.indicators!
    };
  }
}
