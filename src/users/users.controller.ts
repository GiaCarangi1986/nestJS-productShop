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
import { UserService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { GetBestSellersDtoQS } from './dto/getBestSellers-users.dto';
import { UserDto } from './dto/create-user.dto';
import { FiltersQS } from './dto/findAll-user.dto';

@Controller('login')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async login(@Body() params: LoginUserDto) {
    return this.userService.login(params).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}

@Controller('best_sellers')
export class BestSellersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getBestSellers(@Req() params: any) {
    const queryParams: GetBestSellersDtoQS = params.query;
    return this.userService.getBestSellers(queryParams).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}

@Controller('user')
export class UserCRUDController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Req() params: any) {
    const queryParams: FiltersQS = params.query;
    return this.userService.findAllUsers(queryParams).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.userService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post()
  async create(@Body() userData: UserDto) {
    return this.userService.create(userData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch(':id') // запрос получение инфы для редактирования пользовтаеля системы
  async getUserData(@Param('id') id: number) {
    return await this.userService.getUserData(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Put(':id') // запрос на редактирование данных
  async editUserData(@Param('id') id: number, @Body() userData: UserDto) {
    return await this.userService.update(+id, userData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
