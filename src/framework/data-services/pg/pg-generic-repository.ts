import { IntervalType } from "common/enums/count-type.enum";
import AppNotFoundException from "common/exception/app-not-found.exception";
import rescue from "common/helper/rescue.helper";
import { IPaginationData } from "common/interface/response/interface/response-data.interface";
import { IGenericRepository, OtherMethodOptions } from "core/abstracts";
import { EntityManager, ObjectLiteral, Repository } from "typeorm";
import { patchUpdatedAt } from "common/utils/patch-updatedAt";

export class PgGenericRepository<T extends ObjectLiteral> implements IGenericRepository<T>{
  protected _repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this._repository = repository;
  }
  protected getRepo(manager?: EntityManager) {
    return manager
      ? manager.getRepository(this._repository.target)
      : this._repository;
  }

  async getAll(
    condition: NonNullable<unknown> | any[],
    relations: NonNullable<unknown>,
    order: NonNullable<unknown>,
    select: NonNullable<unknown>,
    take: number | undefined = undefined,
    manager?: EntityManager
  ): Promise<IPaginationData> {
    return rescue<IPaginationData>(async (): Promise<IPaginationData> => {
      let page, limit;
      // let { page, limit }
      // this.cls.get<IPaginationQuery>('paginationQuery') || {};
      if (!page) page = 1;
      if (!limit) limit = take !== undefined ? take : 10;

      const repo = this.getRepo(manager);
      const [data, total] = await repo.findAndCount({
        where: Array.isArray(condition) ? [...condition] : condition,
        skip: (page - 1) * limit,
        take: limit,
        relations: { ...relations },
        order: order ?? ({ id: "DESC" } as any),
        select,
      });

      return {
        data: data as [],
        total,
        limit,
        page,
        previous: page > 1 ? `${page - 1}` : null,
        next: page * limit < total ? `${page + 1}` : null,
      };
    });
  }

  async getAllWithCustomPagination(
    condition: NonNullable<unknown> | any[],
    relations: NonNullable<unknown>,
    order: NonNullable<unknown>,
    select: NonNullable<unknown>,
    page: number,
    limit: number,
    manager?: EntityManager
  ): Promise<IPaginationData> {
    return rescue<IPaginationData>(async (): Promise<IPaginationData> => {
      const repo = this.getRepo(manager);
      const [data, total] = await repo.findAndCount({
        where: Array.isArray(condition) ? [...condition] : condition,
        skip: (page - 1) * limit,
        take: limit,
        relations: { ...relations },
        order: order ?? ({ id: "DESC" } as any),
        select,
      });

      return {
        data: data as [],
        total,
        limit,
        page,
        previous: page > 1 ? `${page - 1}` : null,
        next: page * limit < total ? `${page + 1}` : null,
      };
    });
  }

  async getAllWithoutPagination(
    condition: NonNullable<unknown> | any[],
    relations: NonNullable<unknown>,
    order?: NonNullable<unknown>,
    select?: NonNullable<unknown>,
    manager?: EntityManager
  ): Promise<T[]> {
    return rescue<T[]>(async (): Promise<T[]> => {
      const repo = this.getRepo(manager);
      return repo.find({
        select: select,
        where: condition,
        relations: { ...relations },
        order,
      });
    });
  }

  async count(condition: any): Promise<number> {
    return rescue<number>(async (): Promise<number> => {
      const repo = this.getRepo();
      return repo.count({
        where: condition,
      });
    });
  }

  async countWithComplexCondition(condition: any): Promise<number> {
    return rescue<number>(async (): Promise<number> => {
      const repo = this.getRepo();
      const queryBuilder = repo.createQueryBuilder("entity");

      const processCondition = (alias: string, field: string, value: any) => {
        if (Array.isArray(value)) {
          // IN query
          queryBuilder.andWhere(
            `${alias}.${field} IN (:...${alias}_${field}_values)`,
            {
              [`${alias}_${field}_values`]: value,
            }
          );
        } else if (typeof value === "object" && value?.type && value?.value) {
          // Interval filter
          let interval = "";
          switch (value.type) {
            case IntervalType.DAY:
              interval = `${value.value} days`;
              break;
            case IntervalType.WEEK:
              interval = `${value.value} weeks`;
              break;
            case IntervalType.MONTH:
              interval = `${value.value} months`;
              break;
            case IntervalType.YEAR:
              interval = `${value.value} years`;
              break;
            default:
              throw new Error(`Invalid interval type: ${value.type}`);
          }

          queryBuilder.andWhere(
            `${alias}.${field} >= NOW() - INTERVAL '${interval}'`
          );
        } else if (typeof value === "object" && value !== null) {
          // Relation → join and recurse
          const joinAlias = `${alias}_${field}`;
          queryBuilder.leftJoin(`${alias}.${field}`, joinAlias);

          Object.keys(value).forEach((subKey) => {
            processCondition(joinAlias, subKey, value[subKey]);
          });
        } else {
          // Exact match
          queryBuilder.andWhere(`${alias}.${field} = :${alias}_${field}`, {
            [`${alias}_${field}`]: value,
          });
        }
      };

      Object.keys(condition).forEach((key) => {
        processCondition("entity", key, condition[key]);
      });

      return queryBuilder.getCount();
    });
  }

  async countByMonth(condition: any, year: number): Promise<number[]> {
    return rescue<number[]>(async (): Promise<number[]> => {
      const repo = this.getRepo();

      const queryBuilder = repo
        .createQueryBuilder("entity")
        .select("EXTRACT(MONTH FROM entity.createdAt)", "month")
        .addSelect("COUNT(*)", "count")
        .where("EXTRACT(YEAR FROM entity.createdAt) = :year", { year })
        .groupBy("month")
        .orderBy("month");

      /**
       * Simple condition processor — just applies where clauses
       */
      const processCondition = (alias: string, field: string, value: any) => {
        if (Array.isArray(value)) {
          queryBuilder.andWhere(
            `${alias}.${field} IN (:...${alias}_${field}_values)`,
            { [`${alias}_${field}_values`]: value }
          );
        } else if (typeof value === "object" && value !== null) {
          // Relation → join and recurse
          const joinAlias = `${alias}_${field}`;
          queryBuilder.leftJoin(`${alias}.${field}`, joinAlias);
          Object.keys(value).forEach((subKey) => {
            processCondition(joinAlias, subKey, value[subKey]);
          });
        } else {
          // Exact match
          queryBuilder.andWhere(`${alias}.${field} = :${alias}_${field}`, {
            [`${alias}_${field}`]: value,
          });
        }
      };

      // Apply conditions
      Object.keys(condition).forEach((key) => {
        processCondition("entity", key, condition[key]);
      });

      const rawResult = await queryBuilder.getRawMany();

      // Always return 12 months (Jan=0 … Dec=11)
      const result = Array(12).fill(0);
      rawResult.forEach((row) => {
        const monthIndex = parseInt(row.month, 10) - 1;
        result[monthIndex] = parseInt(row.count, 10);
      });

      return result;
    });
  }

  async getOne(
    condition: any,
    relations?: NonNullable<unknown>,
    select?: NonNullable<unknown>,
    manager?: EntityManager
  ): Promise<T> {
    return rescue<T>(async (): Promise<T> => {
      const repo = this.getRepo(manager); // no manager in this signature
      const item = await repo.findOne({
        where: condition,
        relations: relations,
        select: select,
      });

      if (!item) {
        throw new AppNotFoundException(
          repo.metadata.targetName.replace("Entity", "") + " not found",
          404
        );
      }

      return item;
    });
  }

  async getOneOrNull(
    condition: any,
    relations?: NonNullable<unknown>,
    options?: OtherMethodOptions,
    manager?: EntityManager
  ): Promise<T> {
    return rescue<T>(async (): Promise<T |null> => {
      const repo = this.getRepo(manager);
      const item = await repo.findOne({
        where: condition,
        relations: { ...relations },
        ...options,
      });
      return item ?? null;
    });
  }

  async create(item: T, manager?: EntityManager): Promise<T> {
    return rescue<T>(async (): Promise<T> => {
      const repo = this.getRepo(manager);
      return repo.save(item);
    });
  }

  async createBulk(items: T[], manager?: EntityManager): Promise<T[]> {
    return rescue<T[]>(async (): Promise<T[]> => {
      const repo = this.getRepo(manager);
      return repo.save(items);
    });
  }

  async update(
    condition: NonNullable<unknown>,
    item: any,
    manager?: EntityManager
  ): Promise<T> {
    return rescue<T>(async (): Promise<T| null> => {
      const repo = this.getRepo(manager);
      await repo.update(condition, patchUpdatedAt(item));
      return repo.findOneBy(condition);
    });
  }

  async updateMany(
    condition: NonNullable<unknown>,
    item: any,
    manager?: EntityManager
  ): Promise<any> {
    return rescue<any>(async (): Promise<any> => {
      const repo = this.getRepo(manager);
      return repo.update(condition, patchUpdatedAt(item));
    });
  }

  async findOrCreate(
    condition: NonNullable<unknown>,
    item: T,
    relations?: NonNullable<unknown>,
    manager?: EntityManager
  ): Promise<T> {
    return rescue<T>(async (): Promise<T> => {
      const repo = this.getRepo(manager);
      const found = await repo.findOne({
        where: condition,
        relations: { ...relations },
      });
      return found ?? repo.save(item);
    });
  }

  async createOrUpdate(
    condition: NonNullable<unknown>,
    item: any,
    relations?: NonNullable<unknown>,
    manager?: EntityManager
  ): Promise<T> {
    const repo = this.getRepo(manager);
    const found = await repo.findOne({
      where: condition,
      relations: { ...relations },
    });
    if (!found) return repo.save(item);

    const updated = repo.merge(found, item);
    return repo.save(updated);
  }

  async checkIfExists(condition: NonNullable<unknown>): Promise<boolean> {
    return rescue<boolean>(async (): Promise<boolean> => {
      const repo = this.getRepo();
      const count = await repo.count({
        where: condition,
      });
      return count > 0;
    });
  }

  // async remove(
  //   condition: NonNullable<unknown>,
  //   relations?: NonNullable<unknown>,
  //   manager?: EntityManager,
  // ): Promise<any> {
  //   return rescue<any>(async (): Promise<any> => {
  //     const repo = this.getRepo(manager);
  //     const data = await this.getAllWithoutPagination(
  //       condition,
  //       relations,
  //       undefined,
  //       undefined,
  //       manager,
  //     );
  //     return repo.softRemove(data);
  //   });
  // }
  async remove(
    condition: Record<string, any>,
    relations?: Record<string, any>,
    manager?: EntityManager
  ): Promise<any> {
    return rescue(async (): Promise<any> => {
      const repo = this.getRepo(manager);
      const data = await this.getAllWithoutPagination(
        condition,
        relations ?? {},
        undefined,
        undefined,
        manager
      );
      return repo.softRemove(data);
    });
  }

  async delete(
    condition: NonNullable<unknown>,
    relations?: NonNullable<unknown>,
    manager?: EntityManager
  ): Promise<any> {
    return rescue<any>(async (): Promise<any> => {
      const repo = this.getRepo(manager);
      const data = await this.getAllWithoutPagination(
        condition,
        relations as any,
        undefined,
        undefined,
        manager
      );
      return repo.remove(data);
    });
  }
}
