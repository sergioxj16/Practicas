import { Categoria } from "./categoria";
import { Producto } from "./producto";

export interface CategoriasResponse {
    categorias: Categoria[];
}

export interface ProductosResponse {
    productos: Producto[];
}

export interface SingleProductResponse {
    producto: Producto;
}