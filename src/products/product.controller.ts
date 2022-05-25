import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProductService } from './products.service';

import { GetBestSellersDtoQS } from 'src/users/dto/getBestSellers-users.dto';
import { FiltersQS } from './dto/findAll-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    return this.productService.getAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}

@Controller('popular_products')
export class PopularProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getPopularProducts(@Req() params: any) {
    const queryParams: GetBestSellersDtoQS = params.query;
    return this.productService.getBestSellers(queryParams).catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}

@Controller('product_crud')
export class ProductCRUDController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Req() params: any) {
    const queryParams: FiltersQS = params.query;
    return this.productService.findAllCRUD(queryParams).catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch(':id') // запрос получение инфы для редактирования продукта
  async getProductData(@Param('id') id: number) {
    return await this.productService.getProductData(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post()
  async create(@Body() productData: CreateProductDto) {
    return this.productService.create(productData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
