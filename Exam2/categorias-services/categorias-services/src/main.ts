import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/sqlite';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const orm = app.get(MikroORM);
  const schemaGenerator = orm.getSchemaGenerator();

  // Crear tablas automáticamente si no existen
  await schemaGenerator.updateSchema();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((e) => console.error(e));
