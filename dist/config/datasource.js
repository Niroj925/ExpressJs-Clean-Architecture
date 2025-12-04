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
exports.getDataServices = exports.initializeDataSource = void 0;
const data_source_1 = require("infrastructure/data-services/pg/data-source");
const pg_data_services_service_1 = require("infrastructure/data-services/pg/pg-data-services.service");
const in_memory_data_services_1 = __importDefault(require("infrastructure/data-services/in-memory/in-memory-data-services"));
let pgDataServices = null;
function initializeDataSource() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield data_source_1.AppDataSource.initialize();
            // Create PgDataServices using the initialized DataSource; PgDataServices
            // will build repositories for all registered entities automatically.
            pgDataServices = new pg_data_services_service_1.PgDataServices(data_source_1.AppDataSource);
            console.log("Postgres DataSource initialized and PgDataServices created");
            return true;
        }
        catch (err) {
            console.error("Failed to initialize Postgres DataSource:", (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err);
            // Do not throw here if you prefer to run with in-memory fallback; rethrow if you want startup to fail
            pgDataServices = null;
            return false;
        }
    });
}
exports.initializeDataSource = initializeDataSource;
function getDataServices() {
    return pgDataServices !== null && pgDataServices !== void 0 ? pgDataServices : in_memory_data_services_1.default;
}
exports.getDataServices = getDataServices;
exports.default = initializeDataSource;
