import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { Product } from 'src/entities/Product';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService],
  controllers: [],
  exports: [ProductService],
})
export class ProductsModule {}
