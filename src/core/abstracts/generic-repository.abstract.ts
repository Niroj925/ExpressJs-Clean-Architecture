
import { IPaginationData } from 'common/interface/response/interface/response-data.interface';
import { RelationType } from 'common/type/relation';
import { EntityManager } from 'typeorm';
export type keyValueObj = {
  [key: string]: any;
};
export type OtherMethodOptions = {
  withDeleted?: boolean;
};
export abstract class IGenericRepository<T> {
  abstract count(condition?: keyValueObj): Promise<number>;
  abstract countWithComplexCondition(condition?: keyValueObj): Promise<number>;
  abstract countByMonth(
    condition?: keyValueObj,
    year?: number,
  ): Promise<number[]>;

  abstract getAll(
    condition?: keyValueObj | any[],
    relations?: RelationType,
    order?: keyValueObj,
    select?: keyValueObj,
    take?: number | undefined,
    manager?: EntityManager,
  ): Promise<IPaginationData>;

  abstract getAllWithCustomPagination(
    condition: NonNullable<unknown> | any[],
    relations: NonNullable<unknown>,
    order: NonNullable<unknown>,
    select: NonNullable<unknown>,
    page: number,
    limit: number,
    manager?: EntityManager,
  ): Promise<IPaginationData>;

  abstract getAllWithoutPagination(
    condition?: keyValueObj | any[],
    relations?: RelationType,
    order?: keyValueObj,
    select?: keyValueObj,
    manager?: EntityManager,
  ): Promise<T[]>;

  abstract getOne(
    condition: keyValueObj,
    relations?: RelationType,
    select?: keyValueObj,
    manager?: EntityManager,
  ): Promise<T>;

  abstract getOneOrNull(
    condition: keyValueObj | any[],
    relations?: RelationType,
    methodOptions?: OtherMethodOptions,
    manager?: EntityManager,
  ): Promise<T>;

  abstract create(item: T, manager?: EntityManager): Promise<T>;

  abstract update(
    condition: keyValueObj,
    item: T,
    manager?: EntityManager,
  ): Promise<T>;

  abstract findOrCreate(
    condition: keyValueObj,
    item: T,
    relations?: RelationType,
    manager?: EntityManager,
  ): Promise<T>;

  abstract createOrUpdate(
    condition: keyValueObj,
    item: T,
    relations?: RelationType,
    manager?: EntityManager,
  ): Promise<T>;

  abstract checkIfExists(condition: keyValueObj): Promise<boolean>;

  abstract createBulk(items: T[], manager?: EntityManager): Promise<T[]>;

  abstract updateMany(condition: keyValueObj, item: keyValueObj): Promise<any>;

  abstract remove(
    condition: keyValueObj,
    relations?: RelationType,
    manager?: EntityManager,
  ): Promise<any>;

  abstract delete(
    condition: keyValueObj,
    relations?: RelationType,
    manager?: EntityManager,
  ): Promise<any>;
}
