import { ProductosService } from './productos.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    create(createProductDto: CreateProductDto): Promise<{
        producto: import("./producto.entity").Producto;
    }>;
    remove(id: string): Promise<void>;
}
