import { Categoria } from './categoria.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
export declare class CategoriasService {
    private readonly catRepository;
    constructor(catRepository: EntityRepository<Categoria>);
    create(cat: Categoria): Promise<Categoria>;
    findAll(): Promise<Categoria[]>;
    remove(id: number): Promise<void>;
}
