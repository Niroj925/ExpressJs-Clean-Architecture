"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgGenericRepository = void 0;
const count_type_enum_1 = require("common/enums/count-type.enum");
const app_not_found_exception_1 = __importDefault(require("common/exception/app-not-found.exception"));
const rescue_helper_1 = __importDefault(require("common/helper/rescue.helper"));
const patch_updatedAt_1 = require("common/utils/patch-updatedAt");
class PgGenericRepository {
    constructor(repository) {
        this._repository = repository;
    }
    getRepo(manager) {
        return manager
            ? manager.getRepository(this._repository.target)
            : this._repository;
    }
    getAll(condition, relations, order, select, take = undefined, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                let page, limit;
                // let { page, limit }
                // this.cls.get<IPaginationQuery>('paginationQuery') || {};
                if (!page)
                    page = 1;
                if (!limit)
                    limit = take !== undefined ? take : 10;
                const repo = this.getRepo(manager);
                const [data, total] = yield repo.findAndCount({
                    where: Array.isArray(condition) ? [...condition] : condition,
                    skip: (page - 1) * limit,
                    take: limit,
                    relations: Object.assign({}, relations),
                    order: order !== null && order !== void 0 ? order : { id: "DESC" },
                    select,
                });
                return {
                    data: data,
                    total,
                    limit,
                    page,
                    previous: page > 1 ? `${page - 1}` : null,
                    next: page * limit < total ? `${page + 1}` : null,
                };
            }));
        });
    }
    getAllWithCustomPagination(condition, relations, order, select, page, limit, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                const [data, total] = yield repo.findAndCount({
                    where: Array.isArray(condition) ? [...condition] : condition,
                    skip: (page - 1) * limit,
                    take: limit,
                    relations: Object.assign({}, relations),
                    order: order !== null && order !== void 0 ? order : { id: "DESC" },
                    select,
                });
                return {
                    data: data,
                    total,
                    limit,
                    page,
                    previous: page > 1 ? `${page - 1}` : null,
                    next: page * limit < total ? `${page + 1}` : null,
                };
            }));
        });
    }
    getAllWithoutPagination(condition, relations, order, select, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                return repo.find({
                    select: select,
                    where: condition,
                    relations: Object.assign({}, relations),
                    order,
                });
            }));
        });
    }
    count(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo();
                return repo.count({
                    where: condition,
                });
            }));
        });
    }
    countWithComplexCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo();
                const queryBuilder = repo.createQueryBuilder("entity");
                const processCondition = (alias, field, value) => {
                    if (Array.isArray(value)) {
                        // IN query
                        queryBuilder.andWhere(`${alias}.${field} IN (:...${alias}_${field}_values)`, {
                            [`${alias}_${field}_values`]: value,
                        });
                    }
                    else if (typeof value === "object" && (value === null || value === void 0 ? void 0 : value.type) && (value === null || value === void 0 ? void 0 : value.value)) {
                        // Interval filter
                        let interval = "";
                        switch (value.type) {
                            case count_type_enum_1.IntervalType.DAY:
                                interval = `${value.value} days`;
                                break;
                            case count_type_enum_1.IntervalType.WEEK:
                                interval = `${value.value} weeks`;
                                break;
                            case count_type_enum_1.IntervalType.MONTH:
                                interval = `${value.value} months`;
                                break;
                            case count_type_enum_1.IntervalType.YEAR:
                                interval = `${value.value} years`;
                                break;
                            default:
                                throw new Error(`Invalid interval type: ${value.type}`);
                        }
                        queryBuilder.andWhere(`${alias}.${field} >= NOW() - INTERVAL '${interval}'`);
                    }
                    else if (typeof value === "object" && value !== null) {
                        // Relation → join and recurse
                        const joinAlias = `${alias}_${field}`;
                        queryBuilder.leftJoin(`${alias}.${field}`, joinAlias);
                        Object.keys(value).forEach((subKey) => {
                            processCondition(joinAlias, subKey, value[subKey]);
                        });
                    }
                    else {
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
            }));
        });
    }
    countByMonth(condition, year) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
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
                const processCondition = (alias, field, value) => {
                    if (Array.isArray(value)) {
                        queryBuilder.andWhere(`${alias}.${field} IN (:...${alias}_${field}_values)`, { [`${alias}_${field}_values`]: value });
                    }
                    else if (typeof value === "object" && value !== null) {
                        // Relation → join and recurse
                        const joinAlias = `${alias}_${field}`;
                        queryBuilder.leftJoin(`${alias}.${field}`, joinAlias);
                        Object.keys(value).forEach((subKey) => {
                            processCondition(joinAlias, subKey, value[subKey]);
                        });
                    }
                    else {
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
                const rawResult = yield queryBuilder.getRawMany();
                // Always return 12 months (Jan=0 … Dec=11)
                const result = Array(12).fill(0);
                rawResult.forEach((row) => {
                    const monthIndex = parseInt(row.month, 10) - 1;
                    result[monthIndex] = parseInt(row.count, 10);
                });
                return result;
            }));
        });
    }
    getOne(condition, relations, select, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager); // no manager in this signature
                const item = yield repo.findOne({
                    where: condition,
                    relations: relations,
                    select: select,
                });
                if (!item) {
                    throw new app_not_found_exception_1.default(repo.metadata.targetName.replace("Entity", "") + " not found", 404);
                }
                return item;
            }));
        });
    }
    getOneOrNull(condition, relations, options, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                const item = yield repo.findOne(Object.assign({ where: condition, relations: Object.assign({}, relations) }, options));
                return item !== null && item !== void 0 ? item : null;
            }));
        });
    }
    create(item, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                return repo.save(item);
            }));
        });
    }
    createBulk(items, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                return repo.save(items);
            }));
        });
    }
    update(condition, item, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                yield repo.update(condition, (0, patch_updatedAt_1.patchUpdatedAt)(item));
                return repo.findOneBy(condition);
            }));
        });
    }
    updateMany(condition, item, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                return repo.update(condition, (0, patch_updatedAt_1.patchUpdatedAt)(item));
            }));
        });
    }
    findOrCreate(condition, item, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                const found = yield repo.findOne({
                    where: condition,
                    relations: Object.assign({}, relations),
                });
                return found !== null && found !== void 0 ? found : repo.save(item);
            }));
        });
    }
    createOrUpdate(condition, item, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.getRepo(manager);
            const found = yield repo.findOne({
                where: condition,
                relations: Object.assign({}, relations),
            });
            if (!found)
                return repo.save(item);
            const updated = repo.merge(found, item);
            return repo.save(updated);
        });
    }
    checkIfExists(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo();
                const count = yield repo.count({
                    where: condition,
                });
                return count > 0;
            }));
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
    remove(condition, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                const data = yield this.getAllWithoutPagination(condition, relations !== null && relations !== void 0 ? relations : {}, undefined, undefined, manager);
                return repo.softRemove(data);
            }));
        });
    }
    delete(condition, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rescue_helper_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const repo = this.getRepo(manager);
                const data = yield this.getAllWithoutPagination(condition, relations, undefined, undefined, manager);
                return repo.remove(data);
            }));
        });
    }
}
exports.PgGenericRepository = PgGenericRepository;
