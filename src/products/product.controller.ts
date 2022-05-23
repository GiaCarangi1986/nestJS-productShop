import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ProductService } from './products.service';

import { GetBestSellersDtoQS } from 'src/users/dto/getBestSellers-users.dto';

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
  async getAll() {
    return this.productService.getAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
