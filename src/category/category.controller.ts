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
import { CategoryService } from './category.service';
import { CreateCatogoryCheckDto } from './dto/createCheck-category';
import { FiltersQS } from './dto/findAll-category.dto';

@Controller('category')
export class CategoryCRUDController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCaterogies(@Req() params: any) {
    const queryParams: FiltersQS = params.query;
    return this.categoryService.findAll(queryParams).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  // @Delete(':id')
  // async remove(@Param('id') id: number) {
  //   return this.userService.delete(+id).catch((err) => {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   });
  // }

  // @Post()
  // async create(@Body() userData: UserDto) {
  //   return this.userService.create(userData).catch((err) => {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   });
  // }

  // @Patch(':id') // запрос получение инфы для редактирования пользовтаеля системы
  // async getUserData(@Param('id') id: number) {
  //   return await this.userService.getUserData(+id).catch((err) => {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   });
  // }

  // @Put(':id') // запрос на редактирование данных
  // async editUserData(@Param('id') id: number, @Body() userData: UserDto) {
  //   return await this.userService.update(+id, userData).catch((err) => {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   });
  // }
}

@Controller('category_check')
export class CategoryCheckController {
  constructor(private readonly categoryCheckService: CategoryService) {}

  @Post()
  async create(@Body() productData: CreateCatogoryCheckDto) {
    return this.categoryCheckService.createCheck(productData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
