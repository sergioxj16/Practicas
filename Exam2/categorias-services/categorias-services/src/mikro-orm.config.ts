import { Dictionary, IPrimaryKey, Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { NotFoundException } from '@nestjs/common';

type FindOneOrFailHandler = (
  entityName: string,
  where: Dictionary | IPrimaryKey,
) => Error;

const findOneOrFailHandler: FindOneOrFailHandler = (entityName, where) => {
  throw new NotFoundException(
    `${entityName} not found with the following criteria: ${JSON.stringify(where)}`,
  );
};

const mikroOrmConfig: Options = {
  entities: ['./dist/**/*.entity.js'], // Rutas de entidades compiladas
  entitiesTs: ['./src/**/*.entity.ts'], // Rutas de entidades en TypeScript
  dbName: 'categorias.sqlite', // Nombre de la base de datos SQLite
  driver: SqliteDriver,
  debug: true, // Activar logs en desarrollo
  findOneOrFailHandler: findOneOrFailHandler,
  allowGlobalContext: true, // Permitir contexto global (útil para `SchemaGenerator` en aplicaciones pequeñas)
};

export default mikroOrmConfig;
