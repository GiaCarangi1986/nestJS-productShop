import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLine } from 'src/entities/DeliveryLine';
import { UpdateCountDeliveryLineDto } from './dto/updateCount-deliveryLine.dto';

@Injectable()
export class DeliveryLineService {
  constructor(
    @InjectRepository(DeliveryLine)
    private deliveryLineRepository: Repository<DeliveryLine>,
  ) {}

  async deltaCount(productFK: number, deltaCount: number) {
    const deliveryLines = await this.deliveryLineRepository.find({
      where: { productFK },
    });

    if (!deliveryLines.length) {
      throw {
        message: `Не существует продукта с id = ${productFK}`,
      };
    }

    const deliveryLineOld = await this.deliveryLineRepository.findOne(
      deliveryLines[0].id,
    );

    const delta = deliveryLineOld.productCount - deltaCount;
    if (delta < 0) {
      throw {
        message: `Можно купить максимум ${deliveryLineOld.productCount} шт/кг для '${deliveryLineOld.productFK.title}'`,
      };
    }

    return {
      id: deliveryLines[0].id,
      deltaCount: delta,
    };
  }

  async updateArr(deliveryLines: UpdateCountDeliveryLineDto[]) {
    deliveryLines.forEach(async (line) => {
      await this.deliveryLineRepository.update(line.id, {
        productCount: line.deltaCount,
      });
    });
  }
}
