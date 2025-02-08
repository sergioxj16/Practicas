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
exports.CategoriasController = void 0;
const common_1 = require("@nestjs/common");
const categorias_service_1 = require("./categorias.service");
const categoria_entity_1 = require("./categoria.entity");
const productos_service_1 = require("../productos/productos.service");
let CategoriasController = class CategoriasController {
    constructor(categoriasService, productosService) {
        this.categoriasService = categoriasService;
        this.productosService = productosService;
    }
    async findAll() {
        return { categorias: await this.categoriasService.findAll() };
    }
    async findByCategoria(idCat) {
        return { productos: await this.productosService.findByCat(idCat) };
    }
    async create(categoria) {
        return { categoria: await this.categoriasService.create(categoria) };
    }
    async remove(id) {
        await this.categoriasService.remove(+id);
    }
};
exports.CategoriasController = CategoriasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/productos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "findByCategoria", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [categoria_entity_1.Categoria]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriasController.prototype, "remove", null);
exports.CategoriasController = CategoriasController = __decorate([
    (0, common_1.Controller)('categorias'),
    __metadata("design:paramtypes", [categorias_service_1.CategoriasService,
        productos_service_1.ProductosService])
], CategoriasController);
//# sourceMappingURL=categorias.controller.js.map