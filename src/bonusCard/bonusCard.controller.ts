import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { BonusCardService } from './bonusCard.service';
import { GetSearchListBonusCardDto } from './dto/getAllSearch-bonusCard.dto';
import { CreateBonusCardOwnerDto } from './dto/create-bonusCard.dto';
import { FiltersQS } from './dto/findAllOwners-bonusCard.dto';

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
  async getAllOwners(@Req() params: any) {
    const queryParams: FiltersQS = params.query;
    return this.bonusCardService.findAllOwners(queryParams).catch((err) => {
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

  @Patch(':id') // запрос получение инфы для редактирования карты
  async getBonusCardData(@Param('id') id: number) {
    return await this.bonusCardService.getBonusCardData(+id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Put(':id') // запрос на редактирование данных
  async editBonusCardData(
    @Param('id') id: number,
    @Body() bonusCardData: CreateBonusCardOwnerDto,
  ) {
    return await this.bonusCardService
      .updateAllData(+id, bonusCardData)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }
}
