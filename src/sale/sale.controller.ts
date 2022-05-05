import {
  Controller,
  Body,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SaleService } from './sale.service';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async lastDate() {
    return this.saleService.findAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
