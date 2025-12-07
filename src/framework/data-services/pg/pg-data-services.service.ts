import { IDataServices } from "core/abstracts";
import {
  DataSource,
  EntityManager,
} from "typeorm";
import { PgGenericRepository } from "./pg-generic-repository";
import { UserEntity } from "./entities/user.entity";
import { AuthEntity } from "./entities/auth.entity";
import { StockInfoEntity } from "./entities/stock-info.entity";
import { StockPriceEntity } from "./entities/stock-price.entity";

export class PgDataServices implements IDataServices {
  user: PgGenericRepository<UserEntity>;
  auth: PgGenericRepository<AuthEntity>;
  stockInfo: PgGenericRepository<StockInfoEntity>;
  stockPrice: PgGenericRepository<StockPriceEntity>;


  constructor(private dataSource: DataSource) {}

  async initialize() {
    this.user = new PgGenericRepository(
      // UserEntity,
      this.dataSource.getRepository(UserEntity)
    );
    this.auth = new PgGenericRepository(
      this.dataSource.getRepository(AuthEntity)
    );
       this.stockInfo = new PgGenericRepository(
      this.dataSource.getRepository(StockInfoEntity)
    );
       this.stockPrice = new PgGenericRepository(
      this.dataSource.getRepository(StockPriceEntity)
    );
  }

  /** Run operation inside a Transaction */
  async handleTransaction<T>(
    operation: (manager: EntityManager ) => Promise<T>
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  qb<T>(entity: new () => T, alias: string, manager?: EntityManager) {
  return (manager ?? this.dataSource.manager).createQueryBuilder(entity, alias);
}

}
