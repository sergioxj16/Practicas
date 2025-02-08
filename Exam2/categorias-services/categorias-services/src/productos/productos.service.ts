import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Producto } from './producto.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Categoria } from 'src/categorias/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: EntityRepository<Producto>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Producto> {
    const producto = {
      nombre: createProductDto.nombre,
      precio: createProductDto.precio,
      categoria: this.productosRepository
        .getEntityManager()
        .getReference(Categoria, createProductDto.categoria),
    };
    const prod = this.productosRepository.create(producto);
    await this.productosRepository.insert(prod);
    return prod;
  }

  async findByCat(idCat: number): Promise<Producto[]> {
    return this.productosRepository.findAll({
      where: {
        categoria: this.productosRepository
          .getEntityManager()
          .getReference(Categoria, idCat),
      },
    });
  }

  async remove(id: number): Promise<void> {
    const prod = await this.productosRepository.findOneOrFail(id);
    await this.productosRepository.getEntityManager().removeAndFlush(prod);
  }
}
