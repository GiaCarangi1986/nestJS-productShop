import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateOrUpdateCheckDto } from './dto/createUpdate-check.dto';
import { CheckService } from './check.service';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  getAll() {
    return this.checkService.getAll();
  }

  // @Post()
  // create(@Body() product: CreateProductDto) {
  //   return this.productService.create(product);
  // }
}
