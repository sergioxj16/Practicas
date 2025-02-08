import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from './services/services.service';
import { Categoria } from './interfaces/categoria';
import { Producto } from './interfaces/producto';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    #fb = inject(FormBuilder);
    #service = inject(Service);

    categoria = signal<Categoria[]>([]);
    productos = signal<Producto[]>([]);
    categoriaActual = signal<number | null>(null);
    

    constructor() {
        effect(() => {
            this.loadCategoria();
            
        });

        effect(() => {
            const idCategoria = this.categoriaActual();
            if (idCategoria !== null) {
                this.loadProductos(idCategoria);
            }
        });
    }

    loadCategoria() {
        this.#service.getCategorias().subscribe(response => {
            this.categoria.set(response.categorias);
            if (response.categorias.length > 0) {
                this.categoriaActual.set(response.categorias[0].id);
            }
        });
    }

    loadProductos(idCategoria: number) {
        this.#service.getProductosPorCategoria(idCategoria).subscribe(response => {
            this.productos.set(response.productos);
        });
    }

    seleccionarCategoria(id: number) {
        this.categoriaActual.set(id);
    }

    eliminarProducto(idProducto: number) {
        this.#service.eliminarProducto(idProducto).subscribe(() => {
            const productosActuales = this.productos();
            this.productos.set(productosActuales.filter(p => p.id !== idProducto));
        });
    }

    productForm = this.#fb.group({
        nombre: ['', [Validators.required]],
        precio: [0, [Validators.required, Validators.min(1)]],
    });

    addEvent() :void {
        if (this.productForm.valid && this.categoriaActual() !== null) {
            const nuevoProducto: Producto = {
                id: 0,
                nombre: this.productForm.value.nombre!,
                precio: this.productForm.value.precio!,
                categoria: this.categoriaActual()!
            };
            this.#service.insertarProducto(nuevoProducto).subscribe(response => {
                const productosActuales = this.productos();
                this.productos.set([...productosActuales, response.producto]);
                this.productForm.reset({ nombre: '', precio: 0 });
            });
        }
    }
}