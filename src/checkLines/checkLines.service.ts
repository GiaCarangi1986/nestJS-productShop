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

  calc = (line) => {
    const resLine: RevenueDataDto = {
      revenue: 0,
      usedBonuses: 0,
    };
    resLine.revenue += line.price * line.productCount;
    resLine.usedBonuses += line.checkFK.bonusCount;
    return resLine;
  };

  calcDeliv = (line) => {
    const resLine: RevenueDataDto = {
      grossProfit: 0,
    };
    resLine.grossProfit += line.priceBuy * line.productCount;
    return resLine;
  };

  async getRevenueData({ dateStart, dateEnd }: GetBestSellersDtoQS) {
    const deliveryLines = await this.deliveryService.getAllBetweenPeriod(
      dateStart,
      dateEnd,
    );

    const resOnlyDateDeliv = new Set();

    const resDeliv = []; // массив, который буду возвращать (сколько дней что-то покупалось за период, столько тут и значений)
    for (const line of deliveryLines) {
      let contains = false;
      const date = new Date(line.deliveryFK.date);
      for (const resLine of resDeliv) {
        if (date.getTime() === new Date(resLine.date).getTime()) {
          contains = true;
          const resLineCalc = this.calcDeliv(line);
          resLine.grossProfit += resLineCalc.grossProfit;
          break;
        }
      }
      if (!contains) {
        resOnlyDateDeliv.add(date.getTime());
        resDeliv.push({
          date,
          ...this.calcDeliv(line),
        });
      }
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
      date.setHours(3, 0, 0, 0);
      for (const resLine of res) {
        if (date.getTime() === new Date(resLine.date).getTime()) {
          contains = true;
          const resLineCalc = this.calc(line);
          resLine.revenue += resLineCalc.revenue;
          resLine.usedBonuses += resLineCalc.usedBonuses;
          break;
        }
      }
      if (!contains) {
        resOnlyDateDeliv.add(date.getTime());
        res.push({
          date,
          ...this.calc(line),
        });
      }
    }

    const allDates = Array.from(resOnlyDateDeliv).sort();
    const allRes = [];
    for (const date of allDates) {
      const check = res.filter((el) => el.date.getTime() === date)[0];
      const deliv = resDeliv.filter((el) => el.date.getTime() === date)[0];

      const revenue = check?.revenue || 0;
      const grossProfit = deliv?.grossProfit || 0;

      allRes.push({
        date: check?.date || deliv?.date,
        grossProfit: revenue - grossProfit,
        revenue,
        usedBonuses: check?.usedBonuses || 0,
      });
    }

    return allRes;
  }
}
