import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { DeliveryLine } from 'src/entities/DeliveryLine';
import {
  CreateDeliveryLineDBDto,
  CreateDeliveryLineDto,
} from './dto/create-deliveryLine.dto';
import { GetDeliveryLineDto } from './dto/getAllForMakeDelivery-deliveryLine.dto';
import { week, day, month, millisecondsDay } from 'src/const';

import { ProductService } from 'src/products/products.service';
import { CheckService } from 'src/checks/check.service';
import { Delivery } from 'src/entities/Delivery';

@Injectable()
export class DeliveryLineService {
  constructor(
    @InjectRepository(DeliveryLine)
    private deliveryLineRepository: Repository<DeliveryLine>,
    private readonly productService: ProductService,
    private readonly checkService: CheckService,
  ) {}

  deliveryRep = getRepository(Delivery);

  async create(deliveryLineData: CreateDeliveryLineDto) {
    const delivery = await this.deliveryRep.save({
      date: deliveryLineData.date,
    });

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

  async getAllForMakeDelivery(period: number) {
    const checkLines = await this.checkService.getAllByPeriod(
      new Date(new Date().getTime() - period),
    );
    const products: GetDeliveryLineDto[] =
      await this.productService.getAllForMakeDelivery();

    for (const checkLine of checkLines) {
      for (const product of products) {
        if (checkLine.productFK.id === product.id) {
          switch (period) {
            case day * millisecondsDay:
              if (product.expirationDate <= week) {
                product.count += checkLine.productCount;
              }
              break;

            case week * millisecondsDay:
              if (
                product.expirationDate > week &&
                product.expirationDate <= month
              ) {
                product.count += checkLine.productCount;
              }
              break;

            case month * millisecondsDay:
              if (product.expirationDate > month || !product.expirationDate) {
                product.count += checkLine.productCount;
              }
              break;

            default:
              product.count += checkLine.productCount;
              break;
          }
          break;
        }
      }
    }

    for (const product of products) {
      if (product.count < 0) {
        product.count = 0;
      }
      product.totalCost = product.count * product.price;
    }

    const delivers = await this.deliveryRep.find();
    const latestDate = delivers[delivers.length - 1];

    return {
      productList: products,
      latestDate: latestDate.date,
    };
  }
}
