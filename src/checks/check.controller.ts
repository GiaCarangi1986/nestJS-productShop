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
  Patch,
} from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { DeleteDelayCheckDto } from './dto/deleteDelay-check.dto';
import { GetAllChecksDto } from './dto/getAll-check.dto';
import { CheckService } from './check.service';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  async getAll(@Body() params: GetAllChecksDto) {
    return this.checkService.getAll(params).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post()
  async create(@Body() checkData: CreateCheckDto) {
    return this.checkService.create(checkData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Put(':id')
  async updatePaid(@Param('id') id: number, @Body() data: CreateCheckDto) {
    await this.checkService.create(data).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
    return this.checkService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Body() data: DeleteDelayCheckDto) {
    return this.checkService
      .delete(+id, true, data.isCheckDelay)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Patch(':id')
  async getHistory(@Param('id') id: number) {
    return await this.checkService.getHistory(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
