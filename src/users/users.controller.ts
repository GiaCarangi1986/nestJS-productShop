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
} from '@nestjs/common';
import { UserService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { GetBestSellersDtoQS } from './dto/getBestSellers-users.dto';

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
  async getUsers() {
    return this.userService.findAllUsers().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.userService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
