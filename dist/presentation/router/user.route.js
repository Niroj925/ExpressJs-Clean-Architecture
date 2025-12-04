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
exports.createUserRouter = exports.UserRouter = void 0;
const express_1 = require("express");
const core_api_response_1 = require("presentation/api/core-api-response");
class UserRouter {
    constructor(userService) {
        this.userService = userService;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        /** CREATE USER */
        this.router.post("/", 
        //   validateDto(CreateUserDto),
        (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.createUser(req.body);
                return res
                    .status(201)
                    .json(core_api_response_1.CoreApiResponse.success(user, 201, "User created successfully"));
            }
            catch (err) {
                next(err);
            }
        }));
        /** GET ALL USERS */
        this.router.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Read pagination from query parameters, with defaults
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield this.userService.getUsers({ page, limit });
                return res
                    .status(200)
                    .json(core_api_response_1.CoreApiResponse.pagination(result, { page, limit }, 200, "Users fetched successfully"));
            }
            catch (err) {
                next(err);
            }
        }));
        /** GET SINGLE USER */
        this.router.get("/:id", 
        //   validateUUID("id"),
        (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(req.params.id);
                return res.json(core_api_response_1.CoreApiResponse.success(user, 200, "User fetched successfully"));
            }
            catch (err) {
                next(err);
            }
        }));
        /** DELETE USER */
        this.router.delete("/:id", 
        //   validateUUID("id"),
        (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.deleteUser(req.params.id);
                return res.json(core_api_response_1.CoreApiResponse.success({}, 200, "User deleted successfully"));
            }
            catch (err) {
                next(err);
            }
        }));
    }
}
exports.UserRouter = UserRouter;
// Factory function to create and return the router
const createUserRouter = (userService) => {
    return new UserRouter(userService).router;
};
exports.createUserRouter = createUserRouter;
