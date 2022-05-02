import {
  Controller,
  Body,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WriteOffService } from './writeOff.service';

@Controller('writeoff')
export class WriteOffController {
  constructor(private readonly writeOffService: WriteOffService) {}

  @Get()
  async lastDate() {
    return this.writeOffService.findLast().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
