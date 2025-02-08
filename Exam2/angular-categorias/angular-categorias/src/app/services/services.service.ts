import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriasResponse, ProductosResponse, SingleProductResponse } from '../interfaces/responses';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class Service {
  #http = inject(HttpClient);
  #url = 'http://localhost:3000';

  getCategorias(): Observable<CategoriasResponse> {
    return this.#http.get<CategoriasResponse>(`${this.#url}/categorias`);
  }

  getProductosPorCategoria(idCategoria: number): Observable<ProductosResponse> {
    return this.#http.get<ProductosResponse>(`${this.#url}/categorias/${idCategoria}/productos`);
  }

  insertarProducto(producto: Producto): Observable<SingleProductResponse> {
    return this.#http.post<SingleProductResponse>(`${this.#url}/productos`, producto);
  }

  eliminarProducto(idProducto: number): Observable<void> {
    return this.#http.delete<void>(`${this.#url}/productos/${idProducto}`);
  }
}