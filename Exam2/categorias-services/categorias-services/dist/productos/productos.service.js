"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const producto_entity_1 = require("./producto.entity");
const nestjs_1 = require("@mikro-orm/nestjs");
const sqlite_1 = require("@mikro-orm/sqlite");
const categoria_entity_1 = require("../categorias/categoria.entity");
let ProductosService = class ProductosService {
    constructor(productosRepository) {
        this.productosRepository = productosRepository;
    }
    async create(createProductDto) {
        const producto = {
            nombre: createProductDto.nombre,
            precio: createProductDto.precio,
            categoria: this.productosRepository
                .getEntityManager()
                .getReference(categoria_entity_1.Categoria, createProductDto.categoria),
        };
        const prod = this.productosRepository.create(producto);
        await this.productosRepository.insert(prod);
        return prod;
    }
    async findByCat(idCat) {
        return this.productosRepository.findAll({
            where: {
                categoria: this.productosRepository
                    .getEntityManager()
                    .getReference(categoria_entity_1.Categoria, idCat),
            },
        });
    }
    async remove(id) {
        const prod = await this.productosRepository.findOneOrFail(id);
        await this.productosRepository.getEntityManager().removeAndFlush(prod);
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(producto_entity_1.Producto)),
    __metadata("design:paramtypes", [sqlite_1.EntityRepository])
], ProductosService);
//# sourceMappingURL=productos.service.js.map