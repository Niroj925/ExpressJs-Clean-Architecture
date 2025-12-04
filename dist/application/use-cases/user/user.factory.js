"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const user_model_1 = __importDefault(require("core/models/user.model"));
class UserFactory {
    createUser(dto) {
        const userModel = new user_model_1.default();
        if (dto.email)
            userModel.email = dto.email;
        if (dto.name)
            userModel.name = dto.name;
        if (dto.password)
            userModel.password = dto.password;
        return userModel;
    }
}
exports.UserFactory = UserFactory;
exports.default = UserFactory;
