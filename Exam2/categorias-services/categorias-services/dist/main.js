"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const sqlite_1 = require("@mikro-orm/sqlite");
const class_validator_1 = require("class-validator");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const orm = app.get(sqlite_1.MikroORM);
    const schemaGenerator = orm.getSchemaGenerator();
    await schemaGenerator.updateSchema();
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((e) => console.error(e));
//# sourceMappingURL=main.js.map