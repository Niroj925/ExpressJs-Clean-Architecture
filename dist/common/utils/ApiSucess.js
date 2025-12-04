"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSuccess = void 0;
// @desc Structures data from success with more relevant data
class ApiSuccess {
    constructor(data, message) {
        this.success = true;
        this.data = data;
        if (message) {
            this.message = message;
        }
    }
}
exports.ApiSuccess = ApiSuccess;
