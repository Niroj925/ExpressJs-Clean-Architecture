"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const injectable_string_1 = __importDefault(require("common/injectable.string"));
const appDatabase_provider_1 = require("./appDatabase.provider");
const providers = [
    ...appDatabase_provider_1.appDataSourceProviders,
    {
        provide: typeorm_1.DataSource,
        useExisting: injectable_string_1.default.APP_DATA_SOURCE,
    },
    // provide for all entities like this
    {
        provide: user_entity_1.UserEntity.REPOSITORY,
        useFactory: (dataSource) => {
            return dataSource.getRepository(user_entity_1.UserEntity);
        },
        inject: [injectable_string_1.default.APP_DATA_SOURCE],
    },
];
exports.default = providers;
