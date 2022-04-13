import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { BonusCardService } from './bonusCard.service';

@Controller('bonus_card')
export class BonusCardController {
  constructor(private readonly bonusCardService: BonusCardService) {}

  @Get()
  async getAll() {
    return this.bonusCardService.findAll().catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
