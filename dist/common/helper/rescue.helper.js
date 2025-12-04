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
const app_exception_1 = __importDefault(require("common/exception/app.exception"));
const db_exception_parser_1 = require("./db-exception.parser");
const app_not_found_exception_1 = __importDefault(require("common/exception/app-not-found.exception"));
const rescue = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield args());
    }
    catch (e) {
        console.error(e);
        if (e instanceof app_exception_1.default || e instanceof app_not_found_exception_1.default) {
            throw e;
        }
        throw new app_exception_1.default((0, db_exception_parser_1.DbExceptionParser)(e));
    }
});
exports.default = rescue;
