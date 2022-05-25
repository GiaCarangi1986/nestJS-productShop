import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/Category';
import {
  CategoryCRUDController,
  CategoryCheckController,
  CategorySelectController,
} from './category.controller';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ProductsModule],
  providers: [CategoryService],
  controllers: [
    CategoryCRUDController,
    CategoryCheckController,
    CategorySelectController,
  ],
})
export class CategoryModule {}
