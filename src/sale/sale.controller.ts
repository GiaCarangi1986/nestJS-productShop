import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto, CreateSaleCheckDto } from './dto/create-sale.dto';

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

  @Patch(':id') // запрос получение инфы для редактирования акции
  async getBonusCardData(@Param('id') id: number) {
    return await this.saleService.getSaleData(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}

@Controller('sale_check')
export class SaleCheckController {
  constructor(private readonly saleCheckService: SaleService) {}

  @Post()
  async create(@Body() productData: CreateSaleCheckDto) {
    return this.saleCheckService.createCheck(productData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
