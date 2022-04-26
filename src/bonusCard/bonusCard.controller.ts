import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BonusCardService } from './bonusCard.service';
import { GetSearchListBonusCardDto } from './dto/getAllSearch-bonusCard.dto';

@Controller('bonus_card')
export class BonusCardController {
  constructor(private readonly bonusCardService: BonusCardService) {}

  @Get()
  async getAll() {
    return this.bonusCardService.findAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Post()
  async getAllSearch(@Body() params: GetSearchListBonusCardDto) {
    return this.bonusCardService.findAllSearch(params.search).catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
