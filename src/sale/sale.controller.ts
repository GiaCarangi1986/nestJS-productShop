import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Delete,
  Param,
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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.saleService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
