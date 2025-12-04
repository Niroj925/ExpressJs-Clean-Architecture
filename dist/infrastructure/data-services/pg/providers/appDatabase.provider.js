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
exports.appDataSourceProviders = void 0;
const injectable_string_1 = __importDefault(require("common/injectable.string"));
const data_source_1 = require("../data-source");
/**
 * Provider array that returns an initialized TypeORM DataSource.
 *
 * Notes:
 * - This project appears to use a simple provider pattern (not NestJS DI at runtime).
 * - The provider exports a `useFactory` that initializes `AppDataSource` and returns it.
 * - Other files can import this provider list or directly import `AppDataSource`.
 */
exports.appDataSourceProviders = [
    {
        provide: injectable_string_1.default.APP_DATA_SOURCE,
        useFactory: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                if (!data_source_1.AppDataSource.isInitialized) {
                    yield data_source_1.AppDataSource.initialize();
                }
                return data_source_1.AppDataSource;
            }
            catch (error) {
                // Rethrow so caller can decide to fallback to in-memory services
                console.error("Failed to initialize AppDataSource in provider:", (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error);
                throw error;
            }
        }),
        // inject: [],
    },
];
