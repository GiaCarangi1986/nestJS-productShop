import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { CheckService } from './check.service';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  getAll() {
    return this.checkService.getAll();
  }

  @Post()
  create(@Body() product: CreateCheckDto) {
    return this.checkService.create(product);
  }
}
