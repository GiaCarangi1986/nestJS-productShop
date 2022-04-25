import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLine } from 'src/entities/DeliveryLine';
import { CreateDeliveryLineDto } from './dto/delivetyLine-create.dto';
import { CreateDeliveryLineDBDto } from './dto/deliveryLine-createDB.dto';
import { week } from 'src/const';

import { DeliveryService } from 'src/delivery/delivery.service';
import { ProductService } from 'src/products/products.service';
import { CheckService } from 'src/checks/check.service';

@Injectable()
export class DeliveryLineService {
  constructor(
    @InjectRepository(DeliveryLine)
    private deliveryLineRepository: Repository<DeliveryLine>,
    private readonly deliveryService: DeliveryService,
    private readonly productService: ProductService,
    private readonly checkService: CheckService,
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
      this.productService.updateCount(
        line.productFK,
        product.count + line.productCount,
      );
    }

    return delivery.id;
  }

  async getAllForMakeDelivery() {
    const checkLines = await this.checkService.getAllByPeriod(
      new Date(new Date().getTime() - week),
    );
    const products = await this.productService.getAllForMakeDelivery();

    for (const checkLine of checkLines) {
      for (const product of products) {
        if (checkLine.productFK.id === product.id) {
          product.count += checkLine.productCount;
          break;
        }
      }
    }

    for (const product of products) {
      if (product.count < 0) {
        product.count = 0;
      }
    }

    return products;
  }
}
