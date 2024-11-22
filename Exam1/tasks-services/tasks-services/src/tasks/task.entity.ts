import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Task {
  @PrimaryKey()
  id!: number;

  @Property()
  description!: string;

  @Property({ type: 'boolean', default: false })
  finished!: boolean;
}
