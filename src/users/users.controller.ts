import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';

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
