import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DeliveryLineService } from './deliveryLine.service';
import { CreateDeliveryLineDto } from './dto/delivetyLine-create.dto';

@Controller('delivery_line')
export class DeliveryLineController {
  constructor(private readonly deliveryLineService: DeliveryLineService) {}

  @Post()
  async create(@Body() deliveryLineData: CreateDeliveryLineDto) {
    return this.deliveryLineService.create(deliveryLineData).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
