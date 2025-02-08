import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Producto } from './producto.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Producto])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
