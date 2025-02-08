"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("@mikro-orm/sqlite");
const common_1 = require("@nestjs/common");
const findOneOrFailHandler = (entityName, where) => {
    throw new common_1.NotFoundException(`${entityName} not found with the following criteria: ${JSON.stringify(where)}`);
};
const mikroOrmConfig = {
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    dbName: 'categorias.sqlite',
    driver: sqlite_1.SqliteDriver,
    debug: true,
    findOneOrFailHandler: findOneOrFailHandler,
    allowGlobalContext: true,
};
exports.default = mikroOrmConfig;
//# sourceMappingURL=mikro-orm.config.js.map