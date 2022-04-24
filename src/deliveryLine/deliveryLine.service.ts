import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLine } from 'src/entities/DeliveryLine';
import { CreateDeliveryLineDto } from './dto/delivetyLine-create.dto';
import { CreateDeliveryLineDBDto } from './dto/deliveryLine-createDB.dto';

import { DeliveryService } from 'src/delivery/delivery.service';
import { ProductService } from 'src/products/products.service';
import { UpdateCountProductDto } from 'src/products/dto/updateCount-product';

@Injectable()
export class DeliveryLineService {
  constructor(
    @InjectRepository(DeliveryLine)
    private deliveryLineRepository: Repository<DeliveryLine>,
    private readonly deliveryService: DeliveryService,
    private readonly productService: ProductService,
  ) {}

  async create(deliveryLineData: CreateDeliveryLineDto) {
    const delivery = await this.deliveryService.create(deliveryLineData.date);

    for (const line of deliveryLineData.deliveryLines) {
      const product = await this.productService.getById(line.productFK);

      const deliveryLine: CreateDeliveryLineDBDto = {
        productCount: line.productCount,
        priceBuy: line.priceBuy,
        productFK: product,
        deliveryFK: delivery,
      };

      this.deliveryLineRepository.save(deliveryLine);
      this.productService.updateCount(line.productFK, line.productCount);
    }

    return delivery.id;
  }
}
