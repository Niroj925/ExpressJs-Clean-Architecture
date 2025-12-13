import { StockUseCaseService } from "application/use-cases/stock/stock-use-case.service";

export abstract class IBaseStrategy {
constructor(protected stockService:StockUseCaseService){}
}