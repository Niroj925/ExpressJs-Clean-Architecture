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
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryDataServices = void 0;
class InMemoryUserRepository {
    constructor() {
        this.items = [];
    }
    count(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.items.length;
        });
    }
    countWithComplexCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.items.length;
        });
    }
    countByMonth(condition, year) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getAll(condition, relations, order, select, take, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = take !== null && take !== void 0 ? take : 10;
            const page = 1;
            const data = this.items.slice(0, limit);
            return {
                data,
                total: this.items.length,
                limit,
                page,
                previous: null,
                next: null,
            };
        });
    }
    getAllWithCustomPagination(condition, relations, order, select, page, limit, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = (page - 1) * limit;
            const data = this.items.slice(start, start + limit);
            const total = this.items.length;
            const next = start + limit < total ? `?page=${page + 1}&limit=${limit}` : null;
            const previous = page > 1 ? `?page=${page - 1}&limit=${limit}` : null;
            return {
                data,
                total,
                limit,
                page,
                previous,
                next,
            };
        });
    }
    getAllWithoutPagination(condition, relations, order, select, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.items;
        });
    }
    getOne(condition, relations, select, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(condition);
            const found = this.items.find((it) => keys.every((k) => it[k] === condition[k]));
            if (!found)
                throw new Error("Not found");
            return found;
        });
    }
    getOneOrNull(condition, relations, methodOptions, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getOne(condition);
            }
            catch (_a) {
                return null;
            }
        });
    }
    create(item, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = Object.assign({}, item);
            newItem.id = (Date.now() + Math.floor(Math.random() * 1000)).toString();
            newItem.createdAt = new Date();
            newItem.updatedAt = new Date();
            if (newItem.isActive === undefined)
                newItem.isActive = true;
            this.items.push(newItem);
            return newItem;
        });
    }
    update(condition, item, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.getOne(condition);
            Object.assign(existing, item);
            existing.updatedAt = new Date();
            return existing;
        });
    }
    findOrCreate(condition, item, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.getOneOrNull(condition);
            if (found)
                return found;
            return this.create(item, manager);
        });
    }
    createOrUpdate(condition, item, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.getOneOrNull(condition);
            if (found)
                return this.update(condition, item, manager);
            return this.create(item, manager);
        });
    }
    checkIfExists(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.getOneOrNull(condition);
            return !!found;
        });
    }
    createBulk(items, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = [];
            for (const it of items)
                created.push(yield this.create(it, manager));
            return created;
        });
    }
    updateMany(condition, item) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const it of this.items)
                Object.assign(it, item);
            return true;
        });
    }
    remove(condition, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const idx = this.items.findIndex((it) => Object.keys(condition).every((k) => it[k] === condition[k]));
            if (idx >= 0)
                this.items.splice(idx, 1);
            return true;
        });
    }
    delete(condition, relations, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.remove(condition, relations, manager);
        });
    }
}
class InMemoryDataServices {
    constructor() {
        this.user = new InMemoryUserRepository();
    }
}
exports.inMemoryDataServices = new InMemoryDataServices();
exports.default = exports.inMemoryDataServices;
