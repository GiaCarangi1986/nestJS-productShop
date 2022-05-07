import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { GenderService } from './gender.service';

@Controller('gender')
export class GenderController {
  constructor(private readonly saleService: GenderService) {}

  @Get()
  async lastDate() {
    return this.saleService.getForSelect().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
