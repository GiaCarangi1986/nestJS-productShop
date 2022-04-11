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

  async getAllByProductId(productFK: number): Promise<DeliveryLine> {
    const deliveryLines = await this.deliveryLineRepository.find({
      where: { productFK },
    });
    return deliveryLines[0];
  }

  // async createCheckLinesArr(checkLineArray: CheckLineCreateDto[]) {
  //   checkLineArray.forEach(async (line) => {
  //     this.checkLineRepository.create(line);
  //     await this.checkLineRepository.save(line);
  //   });
  // }

  // async deleteOne(id: number) {
  //   await this.checkLineRepository.delete(id);
  // }

  async updateOne(deliveryLine: UpdateCountDeliveryLineDto) {
    const deliveryLineOld = await this.deliveryLineRepository.findOne({
      id: deliveryLine.id,
    });
    await this.deliveryLineRepository.update(deliveryLine.id, {
      productCount: deliveryLineOld.productCount - deliveryLine.deltaCount,
    });
  }
}
