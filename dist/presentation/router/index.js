"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("application/use-cases/user/user.service");
const user_route_1 = require("./user.route");
const user_factory_1 = __importDefault(require("application/use-cases/user/user.factory"));
const datasource_1 = require("config/datasource");
const router = (0, express_1.Router)();
// Initialize your user service with its dependencies
// Replace with your actual dependencies
// Create the user service using whichever data services are available
const userService = new user_service_1.UserUseCaseService((0, datasource_1.getDataServices)(), new user_factory_1.default());
// Mount the user routes
router.use("/users", (0, user_route_1.createUserRouter)(userService));
exports.default = router;
