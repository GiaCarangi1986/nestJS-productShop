import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BonusCardService } from './bonusCard.service';
import { GetSearchListBonusCardDto } from './dto/getAllSearch-bonusCard.dto';
import { CreateBonusCardOwnerDto } from './dto/create-bonusCard.dto';

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

@Controller('bonus_card_owner')
export class BonusCardOwnerController {
  constructor(private readonly bonusCardService: BonusCardService) {}

  @Get()
  async getAllOwners() {
    return this.bonusCardService.findAllOwners().catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.bonusCardService.delete(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post()
  async create(@Body() bonusCardData: CreateBonusCardOwnerDto) {
    return this.bonusCardService.create(bonusCardData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
