import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async lastDate() {
    return this.saleService.findAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.saleService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post()
  async create(@Body() saleData: CreateSaleDto) {
    return this.saleService.create(saleData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
