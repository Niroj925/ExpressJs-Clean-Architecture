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
exports.PgDataServices = void 0;
const pg_generic_repository_1 = require("./pg-generic-repository");
class PgDataServices {
    constructor(dataSource) {
        this.dataSource = dataSource;
        // create repository wrapper for each entity registered in the DataSource
        for (const meta of this.dataSource.entityMetadatas) {
            const EntityClass = meta.target;
            const rawName = EntityClass.name || meta.name;
            const name = rawName.replace(/Entity$/, '');
            const key = name.charAt(0).toLowerCase() + name.slice(1);
            try {
                const repo = this.dataSource.getRepository(EntityClass);
                this[key] = new pg_generic_repository_1.PgGenericRepository(repo);
            }
            catch (err) {
                // ignore repositories we can't create
            }
        }
        // ensure `user` exists if user entity was registered
        if (!this.user && this['user']) {
            this.user = this['user'];
        }
    }
    /**
     * Execute a function within a database transaction
     * @param operation The function to execute within the transaction
     * @returns The result of the operation
     *
     */
    handleTransaction(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = this.dataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const result = yield operation(queryRunner.manager);
                yield queryRunner.commitTransaction();
                return result;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    qb(entity, alias, manager) {
        return (manager !== null && manager !== void 0 ? manager : this.dataSource.manager).createQueryBuilder(entity, alias);
    }
}
exports.PgDataServices = PgDataServices;
