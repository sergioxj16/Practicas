import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Categoria } from './categoria.entity';
import { EntityRepository } from '@mikro-orm/sqlite';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly catRepository: EntityRepository<Categoria>,
  ) {}

  async create(cat: Categoria): Promise<Categoria> {
    const categoria = this.catRepository.create(cat);
    await this.catRepository.insert(categoria);
    return categoria;
  }

  async findAll(): Promise<Categoria[]> {
    return this.catRepository.findAll();
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.catRepository.findOneOrFail(id);
    await this.catRepository.getEntityManager().removeAndFlush(categoria);
  }
}
