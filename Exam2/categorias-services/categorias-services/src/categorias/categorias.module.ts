import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Categoria } from './categoria.entity';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [MikroOrmModule.forFeature([Categoria]), ProductosModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
