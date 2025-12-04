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
exports.UserUseCaseService = void 0;
class UserUseCaseService {
    constructor(dataServices, userFactory) {
        this.dataServices = dataServices;
        this.userFactory = userFactory;
    }
    // CREATE USER
    createUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = this.userFactory.createUser(dto);
            return yield this.dataServices.user.create(userModel);
        });
    }
    // GET SINGLE USER BY ID
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.dataServices.user.getOne({ id });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    // GET ALL USERS (Supports Pagination)
    getUsers(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = options;
            // Prefer a repository-level pagination method when page is provided
            if (typeof this.dataServices.user.getAllWithCustomPagination === 'function') {
                // @ts-ignore - some concrete implementations provide this method
                return yield this.dataServices.user.getAllWithCustomPagination({}, {}, {}, {}, page, limit);
            }
            // Fallback to the simpler getAll which supports `take` (limit)
            return yield this.dataServices.user.getAll({}, // condition (empty = all)
            {}, // relations
            {}, // order
            undefined, // select
            limit);
        });
    }
    // DELETE USER
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(id); // will throw if not found
            return yield this.dataServices.user.delete({ id: user.id });
        });
    }
}
exports.UserUseCaseService = UserUseCaseService;
