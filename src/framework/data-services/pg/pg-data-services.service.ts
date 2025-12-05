import { IDataServices } from "core/abstracts";
import {
  DataSource,
  Repository,
  EntityManager,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm";
import { PgGenericRepository } from "./pg-generic-repository";
import { UserEntity } from "./entities/user.entity";
import { AuthEntity } from "./entities/auth.entity";

export class PgDataServices implements IDataServices {
  user: PgGenericRepository<UserEntity>;
  auth: PgGenericRepository<AuthEntity>;

  constructor(private dataSource: DataSource) {}

  async initialize() {
    this.user = new PgGenericRepository(
      // UserEntity,
      this.dataSource.getRepository(UserEntity)
    );
    this.auth = new PgGenericRepository(
      this.dataSource.getRepository(AuthEntity)
    );
  }

  /** Run operation inside a Transaction */
  async handleTransaction<T>(
    operation: (manager: EntityManager) => Promise<T>
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
