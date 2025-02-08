import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Categoria } from 'src/categorias/categoria.entity';

@Entity()
export class Producto {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  precio!: number;

  @ManyToOne(() => Categoria, {
    nullable: false,
    deleteRule: 'cascade',
  })
  categoria: Categoria;
}
