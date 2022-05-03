import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { Product } from 'src/entities/Product';
import {
  ProductController,
  PopularProductController,
} from './product.controller';

import { CheckModule } from 'src/checks/check.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), forwardRef(() => CheckModule)],
  providers: [ProductService],
  controllers: [ProductController, PopularProductController],
  exports: [ProductService],
})
export class ProductsModule {}
