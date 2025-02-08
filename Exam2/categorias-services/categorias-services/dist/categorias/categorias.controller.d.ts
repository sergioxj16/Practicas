import { CategoriasService } from './categorias.service';
import { Categoria } from './categoria.entity';
import { ProductosService } from 'src/productos/productos.service';
export declare class CategoriasController {
    private readonly categoriasService;
    private readonly productosService;
    constructor(categoriasService: CategoriasService, productosService: ProductosService);
    findAll(): Promise<{
        categorias: Categoria[];
    }>;
    findByCategoria(idCat: number): Promise<{
        productos: import("../productos/producto.entity").Producto[];
    }>;
    create(categoria: Categoria): Promise<{
        categoria: Categoria;
    }>;
    remove(id: number): Promise<void>;
}
