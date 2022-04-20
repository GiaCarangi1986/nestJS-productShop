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
  Req,
} from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { DeleteDelayCheckDto } from './dto/deleteDelay-check.dto';
import { CheckService } from './check.service';
import { GetAllChecksDtoQS } from './dto/getAll-check.dto';
import { serializerCheckFromQS } from './check.serializer';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  async getAll(@Req() params: any) {
    const queryParams: GetAllChecksDtoQS = params.query;
    return this.checkService
      .getAll(serializerCheckFromQS(queryParams))
      .catch((err) => {
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

@Controller('check_additionally')
export class CheckAdditionallyController {
  constructor(private readonly checkService: CheckService) {}

  @Delete(':id')
  async remove(@Param('id') id: number, @Body() data: DeleteDelayCheckDto) {
    return this.checkService
      .delete(+id, false, data.isCheckDelay, true)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }
}
