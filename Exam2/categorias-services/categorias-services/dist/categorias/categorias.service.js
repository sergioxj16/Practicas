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
exports.CategoriasService = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const categoria_entity_1 = require("./categoria.entity");
const sqlite_1 = require("@mikro-orm/sqlite");
let CategoriasService = class CategoriasService {
    constructor(catRepository) {
        this.catRepository = catRepository;
    }
    async create(cat) {
        const categoria = this.catRepository.create(cat);
        await this.catRepository.insert(categoria);
        return categoria;
    }
    async findAll() {
        return this.catRepository.findAll();
    }
    async remove(id) {
        const categoria = await this.catRepository.findOneOrFail(id);
        await this.catRepository.getEntityManager().removeAndFlush(categoria);
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(categoria_entity_1.Categoria)),
    __metadata("design:paramtypes", [sqlite_1.EntityRepository])
], CategoriasService);
//# sourceMappingURL=categorias.service.js.map