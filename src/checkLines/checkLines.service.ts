import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckLineCreateDto } from './dto/create-checkLine.dto';
import { CheckLine } from '../entities/CheckLine';
import { RevenueDataDto } from './dto/revenueData-checkLine.dto';

import { CheckService } from 'src/checks/check.service';

import { DeliveryService } from 'src/delivery/delivery.service';

import { GetBestSellersDtoQS } from 'src/users/dto/getBestSellers-users.dto';

import { ProductService } from 'src/products/products.service';

@Injectable()
export class CheckLineService {
  constructor(
    @InjectRepository(CheckLine)
    private checkLineRepository: Repository<CheckLine>,
    private readonly deliveryService: DeliveryService,

    @Inject(forwardRef(() => CheckService))
    private checkService: CheckService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async getAllByCheckId(checkFK: number): Promise<CheckLine[]> {
    const checkLines = await this.checkLineRepository.find({
      where: { checkFK },
    });
    return checkLines;
  }

  async createCheckLinesArr(checkLineArray: CheckLineCreateDto[]) {
    for (const line of checkLineArray) {
      await this.checkLineRepository.save(line);
    }
  }

  async deleteArr(idArr: Array<number>) {
    for (const id of idArr) {
      await this.checkLineRepository.delete(id);
    }
  }

  async updateOne(checkLine: CheckLine) {
    await this.checkLineRepository.update(checkLine.id, {
      productCount: checkLine.productCount,
      oldProduct: checkLine.oldProduct,
    });
  }

  calc = (products, line) => {
    const resLine: RevenueDataDto = {
      grossProfit: 0,
      revenue: 0,
      usedBonuses: 0,
    };
    for (const product of products) {
      if (product.id === line.productFK.id) {
        resLine.grossProfit +=
          (line.price - product.averageCost) * line.productCount;
        break;
      }
    }
    resLine.revenue += line.price * line.productCount;
    resLine.usedBonuses += line.checkFK.bonusCount;
    return resLine;
  };

  async getRevenueData({ dateStart, dateEnd }: GetBestSellersDtoQS) {
    const deliveryLines = await this.deliveryService.getAllBetweenPeriod(
      dateStart,
      dateEnd,
    );
    const products = await this.productService.getAllForRevenueData();
    for (const line of deliveryLines) {
      for (const product of products) {
        if (line.productFK.id === product.id) {
          product.count += line.productCount;
          product.cost += line.priceBuy;
        }
      }
    }
    for (const product of products) {
      // узнали для каждого продукта его среднюю цену по закупкам на данное число
      product.averageCost = product.count ? product.cost / product.count : 0;
    }

    const checkLines = await this.checkService.getAllBetweenPeriod(
      dateStart,
      dateEnd,
    );
    const res = []; // массив, который буду возвращать (сколько дней что-то покупалось за период, столько тут и значений)
    for (const line of checkLines) {
      let contains = false;
      const day = line.checkFK.dateTime.getDate();
      const month = line.checkFK.dateTime.getMonth();
      const year = line.checkFK.dateTime.getFullYear();
      const date = new Date(year, month, day);
      for (const resLine of res) {
        if (date.getTime() === new Date(resLine.date).getTime()) {
          contains = true;
          const resLineCalc = this.calc(products, line);
          resLine.grossProfit += resLineCalc.grossProfit;
          resLine.revenue += resLineCalc.revenue;
          resLine.usedBonuses += resLineCalc.usedBonuses;
          break;
        }
      }
      if (!contains) {
        res.push({
          date,
          ...this.calc(products, line),
        });
      }
    }

    return res;
  }
}
