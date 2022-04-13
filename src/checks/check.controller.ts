import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { DeleteDelayCheckDto } from './dto/deleteDelay-check.dto';
import { CheckService } from './check.service';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  getAll() {
    return this.checkService.getAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Post()
  async create(@Body() checkData: CreateCheckDto) {
    return this.checkService.create(checkData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Put(':id')
  async updatePaid(@Param('id') id: number, @Body() data: CreateCheckDto) {
    await this.checkService.create(data).catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
    return this.checkService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Body() data: DeleteDelayCheckDto) {
    return this.checkService
      .delete(+id, true, data.isCheckDelay)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
