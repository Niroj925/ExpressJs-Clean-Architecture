"use strict";
// import rescue from 'src/common/helpers/rescue.helper';
// import { AppClsStore } from 'src/common/interface/app-cls-store.interface';
// import { IClsStore } from 'src/core/abstracts/adapters/cls-store.abstract';
// import { ITransactionRepository } from 'src/core/abstracts/repositories/transaction/transcation.abstract';
// import { EntityManager, Repository } from 'typeorm';
// import { TransactionEntity } from '../entities/transaction.entity';
// import { PgGenericRepository } from '../pg-generic-repository';
// import { IPaginationData } from 'src/common/interface/response/interface/response-data.interface';
// import { IPaginationQuery } from 'src/common/interface/response/interface/pagination.options.interface';
// import { TransactionModel } from 'src/core/models/payment/transaction/transaction.model';
// import AppNotFoundException from 'src/application/exception/app-not-found.exception';
// import { patchUpdatedAt } from 'src/common/utils/patch-updatedAt';
// export class PgTransactionRepository
//   extends PgGenericRepository<TransactionEntity>
//   implements ITransactionRepository<TransactionEntity>
// {
//   protected _repository: Repository<TransactionEntity>;
//   protected cls: IClsStore<AppClsStore>;
//   constructor(
//     cls: IClsStore<AppClsStore>,
//     repository: Repository<TransactionEntity>,
//   ) {
//     super(cls, repository);
//   }
//   async findAllTransactions(
//     condition: NonNullable<unknown> | any[],
//     relations: NonNullable<unknown>,
//     order: NonNullable<unknown>,
//     select: NonNullable<unknown>,
//     take: number | undefined = undefined,
//     manager?: EntityManager,
//   ): Promise<IPaginationData> {
//     return rescue<IPaginationData>(async (): Promise<IPaginationData> => {
//       let { page, limit } =
//         this.cls.get<IPaginationQuery>('paginationQuery') || {};
//       if (!page) page = 1;
//       if (!limit) limit = take !== undefined ? take : 10;
//       const repo = this.getRepo(manager);
//       const [data, total] = await repo.findAndCount({
//         where: Array.isArray(condition) ? [...condition] : condition,
//         skip: (page - 1) * limit,
//         take: limit,
//         relations: { ...relations },
//         order: order ?? ({ id: 'DESC' } as any),
//         select,
//       });
//       return {
//         data: data as [],
//         total,
//         limit,
//         page,
//         previous: page > 1 ? `${page - 1}` : null,
//         next: page * limit < total ? `${page + 1}` : null,
//       };
//     });
//   }
//   //
//   async findAllTransactionWithoutPagination(
//     condition: NonNullable<unknown> | any[],
//     relations: NonNullable<unknown>,
//     order?: NonNullable<unknown>,
//     select?: NonNullable<unknown>,
//     manager?: EntityManager,
//   ): Promise<TransactionEntity[]> {
//     return rescue<TransactionEntity[]>(
//       async (): Promise<TransactionEntity[]> => {
//         const repo = this.getRepo(manager);
//         return repo.find({
//           select: select,
//           where: condition,
//           relations: { ...relations },
//           order,
//         });
//       },
//     );
//   }
//   async findTransaction(
//     condition: Partial<TransactionEntity>,
//     relations?: NonNullable<unknown>,
//     select?: NonNullable<unknown>,
//     manager?: EntityManager,
//   ): Promise<TransactionEntity> {
//     return rescue<TransactionEntity>(async (): Promise<TransactionEntity> => {
//       const repo = this.getRepo(manager);
//       const transaction = await repo.findOne({
//         where: condition as any,
//         relations: relations,
//         select: select,
//       });
//       if (!transaction) {
//         throw new AppNotFoundException(
//           repo.metadata.targetName.replace('Entity', '') + ' not found',
//           404,
//         );
//       }
//       return transaction;
//     });
//   }
//   async createTransaction(
//     item: TransactionEntity,
//     manager?: EntityManager,
//   ): Promise<TransactionEntity> {
//     return rescue<TransactionEntity>(async (): Promise<TransactionEntity> => {
//       const repo = this.getRepo(manager);
//       return repo.save(item);
//     });
//   }
//   async updateTransaction(
//     condition: Partial<TransactionEntity>,
//     item: Partial<TransactionEntity>,
//     manager?: EntityManager,
//   ): Promise<TransactionEntity> {
//     return rescue<TransactionEntity>(async (): Promise<TransactionEntity> => {
//       const repo = this.getRepo(manager);
//       const situation = condition as any;
//       await repo.update(situation, patchUpdatedAt(item));
//       return repo.findOneBy(situation);
//     });
//   }
//   async createBulkTransactions(
//     items: TransactionEntity[],
//     manager?: EntityManager,
//   ): Promise<TransactionEntity[]> {
//     return rescue<TransactionEntity[]>(
//       async (): Promise<TransactionEntity[]> => {
//         const repo = this.getRepo(manager);
//         return repo.save(items);
//       },
//     );
//   }
//   async checkIfTransactionExists(
//     condition?: Partial<TransactionEntity>,
//   ): Promise<boolean> {
//     return rescue<boolean>(async (): Promise<boolean> => {
//       const repo = this.getRepo();
//       const count = await repo.count({
//         where: condition as any,
//       });
//       return count > 0;
//     });
//   }
//   async countTransaction(
//     condition?: Partial<TransactionModel>,
//   ): Promise<number> {
//     return rescue<number>(async (): Promise<number> => {
//       const repo = this.getRepo();
//       return repo.count({
//         where: condition as any,
//       });
//     });
//   }
// }
