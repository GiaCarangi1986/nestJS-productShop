import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './products.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async login() {
    return this.productService.getAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
