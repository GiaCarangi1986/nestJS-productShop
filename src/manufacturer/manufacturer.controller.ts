import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { FiltersQS } from './dto/findAll-manufacturer.dto';
import {
  CreateManufacturerCheckDto,
  CreateManufacturerDto,
} from './dto/create-manufacturer.dto';

@Controller('manufacturer')
export class ManufacturerCRUDController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  async getCaterogies(@Req() params: any) {
    const queryParams: FiltersQS = params.query;
    return this.manufacturerService.findAll(queryParams).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  // @Delete(':id')
  // async remove(@Param('id') id: number) {
  //   return this.categoryService.delete(+id).catch((err) => {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   });
  // }

  @Post()
  async create(@Body() manufacturerData: CreateManufacturerDto) {
    return this.manufacturerService.create(manufacturerData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  // @Patch(':id') // запрос получение инфы для редактирования пользовтаеля системы
  // async getCategoryData(@Param('id') id: number) {
  //   return await this.categoryService.getCategoryData(+id).catch((err) => {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   });
  // }

  // @Put(':id') // запрос на редактирование данных
  // async editCategoryData(
  //   @Param('id') id: number,
  //   @Body() categoryData: CreateCategoryDto,
  // ) {
  //   return await this.categoryService.update(+id, categoryData).catch((err) => {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   });
  // }
}

@Controller('manufacturer_check')
export class ManufacturerCheckController {
  constructor(private readonly manufacturerCheckService: ManufacturerService) {}

  @Post()
  async create(@Body() productData: CreateManufacturerCheckDto) {
    return this.manufacturerCheckService
      .createCheck(productData)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }
}
