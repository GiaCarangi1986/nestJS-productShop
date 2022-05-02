import {
  Controller,
  Body,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WriteOffService } from './writeOff.service';
import { WriteOffDto } from './dto/writeoff.dto';

@Controller('writeoff')
export class WriteOffController {
  constructor(private readonly writeOffService: WriteOffService) {}

  @Get()
  async lastDate() {
    return this.writeOffService.findLast().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post()
  async writeOffProducts(@Body() params: WriteOffDto) {
    return this.writeOffService.writeOffProducts(params).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
