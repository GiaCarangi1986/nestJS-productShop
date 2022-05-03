import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CheckLineService } from './checkLines.service';

import { GetBestSellersDtoQS } from 'src/users/dto/getBestSellers-users.dto';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly checkLineService: CheckLineService) {}

  @Get()
  async getRevenueData(@Req() params: any) {
    const queryParams: GetBestSellersDtoQS = params.query;
    return this.checkLineService.getRevenueData(queryParams).catch((err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
