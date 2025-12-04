import UserModel from "core/models/user.model";
import { IGenericRepository } from "./generic-repository.abstract";
import { EntityManager, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { AuthModel } from "core/models/auth.model";

export abstract class IDataServices {
  abstract user: IGenericRepository<UserModel>;
  abstract auth: IGenericRepository<AuthModel>;

  /**
   * Execute a function within a database transaction
   * @param operation The function to execute within the transaction
   * @returns The result of the operation
   */
  abstract handleTransaction<T>(
    operation: (manager: EntityManager) => Promise<T>,
  ): Promise<T>;

  /**
   * Get a query builder for a specific entity
   * @param entity The entity class
   * @param alias The alias to use for the entity
   * @param manager The entity manager to use (optional)
   * @returns A query builder for the specified entity
   */
  abstract qb<T extends ObjectLiteral>(
    entity: new () => T,
    alias: string,
    manager?: EntityManager,
  ): SelectQueryBuilder<T>;
}