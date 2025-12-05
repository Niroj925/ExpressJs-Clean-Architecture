import UserModel from "core/models/user.model";
import { IGenericRepository } from "./generic-repository.abstract";
import { AuthModel } from "core/models/auth.model";

export abstract class IDataServices {
  abstract user: IGenericRepository<UserModel>;
  abstract auth: IGenericRepository<AuthModel>;


  abstract handleTransaction<T>(
    operation: (tx: unknown) => Promise<T>,  
  ): Promise<T>;
  

  abstract qb<T>(entity: new () => T, alias: string): unknown; 
}