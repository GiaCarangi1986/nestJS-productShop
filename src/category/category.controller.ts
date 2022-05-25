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
import {
  CreateCatogoryCheckDto,
  CreateCategoryDto,
} from './dto/create-category.dto';
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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.categoryService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post()
  async create(@Body() categoryData: CreateCategoryDto) {
    return this.categoryService.create(categoryData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch(':id') // запрос получение инфы для редактирования пользовтаеля системы
  async getCategoryData(@Param('id') id: number) {
    return await this.categoryService.getCategoryData(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Put(':id') // запрос на редактирование данных
  async editCategoryData(
    @Param('id') id: number,
    @Body() categoryData: CreateCategoryDto,
  ) {
    return await this.categoryService.update(+id, categoryData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
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

  @Patch(':id') // запрос проверки удаляемой категории
  async getCategoryData(@Param('id') id: number) {
    return await this.categoryCheckService
      .createCheckDelete(+id)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }
}

@Controller('category_select')
export class CategorySelectController {
  constructor(private readonly categorySelectService: CategoryService) {}

  @Get()
  async getAllForSelect() {
    return this.categorySelectService.getAllForSelect().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
