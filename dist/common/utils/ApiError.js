"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
// @desc Structures data from error with more relevant data
class ApiError extends Error {
    constructor(data, statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
exports.ApiError = ApiError;
