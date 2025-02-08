import { CreateProductDto } from './dto/create-product.dto';
import { Producto } from './producto.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
export declare class ProductosService {
    private readonly productosRepository;
    constructor(productosRepository: EntityRepository<Producto>);
    create(createProductDto: CreateProductDto): Promise<Producto>;
    findByCat(idCat: number): Promise<Producto[]>;
    remove(id: number): Promise<void>;
}
