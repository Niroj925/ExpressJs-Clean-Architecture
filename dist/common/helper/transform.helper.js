"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIfString = exports.transformObjectToClass = void 0;
const class_transformer_1 = require("class-transformer");
function transformObjectToClass(sourceObject, targetClass) {
    return (0, class_transformer_1.plainToInstance)(targetClass, sourceObject, {
        enableImplicitConversion: false,
        excludeExtraneousValues: true,
    });
}
exports.transformObjectToClass = transformObjectToClass;
function parseIfString() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (_a) {
                // leave it as-is – class-validator will complain
                return value;
            }
        }
        return value;
    });
}
exports.parseIfString = parseIfString;
