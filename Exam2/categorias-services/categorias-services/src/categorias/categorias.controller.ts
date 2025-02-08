import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { Categoria } from './categoria.entity';
import { ProductosService } from 'src/productos/productos.service';

@Controller('categorias')
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService,
    private readonly productosService: ProductosService,
  ) {}

  @Get()
  async findAll() {
    return { categorias: await this.categoriasService.findAll() };
  }

  @Get(':id/productos')
  async findByCategoria(@Param('id', ParseIntPipe) idCat: number) {
    return { productos: await this.productosService.findByCat(idCat) };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() categoria: Categoria) {
    return { categoria: await this.categoriasService.create(categoria) };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriasService.remove(+id);
  }
}
