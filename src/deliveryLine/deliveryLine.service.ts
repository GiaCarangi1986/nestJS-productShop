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

  // async getAllByProductId(productFK: number): Promise<DeliveryLine> {
  //   const deliveryLines = await this.deliveryLineRepository.find({
  //     where: { productFK },
  //   });
  //   return deliveryLines[0];
  // }

  async deltaCount(productFK: number, deltaCount: number) {
    const deliveryLines = await this.deliveryLineRepository.find({
      where: { productFK },
    });
    const deliveryLineOld = await this.deliveryLineRepository.findOne(
      deliveryLines[0].id,
    );
    const delta = deliveryLineOld.productCount - deltaCount;
    return {
      id: deliveryLines[0].id,
      deltaCount: delta,
      error:
        delta < 0
          ? `Можно купить максимум ${deliveryLineOld.productCount} шт/кг для ${deliveryLineOld.productFK.title}`
          : '',
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
