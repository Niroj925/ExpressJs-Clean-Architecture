import UserModel from "core/models/user.model";
import { IGenericRepository } from "./generic-repository.abstract";
import { AuthModel } from "core/models/auth.model";
import StockInfoModel from "core/models/stock-info.model";
import StockPriceModel from "core/models/stock-price.model";

export abstract class IDataServices {
  abstract user: IGenericRepository<UserModel>;
  abstract auth: IGenericRepository<AuthModel>;
  abstract stockInfo: IGenericRepository<StockInfoModel>;
  abstract stockPrice: IGenericRepository<StockPriceModel>;

  abstract handleTransaction<T>(
    operation: (tx: unknown) => Promise<T>,  
  ): Promise<T>;
  

  abstract qb<T>(entity: new () => T, alias: string): unknown; 
}