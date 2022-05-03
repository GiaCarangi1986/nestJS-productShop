import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Delivery } from 'src/entities/Delivery';

import { DeliveryLine } from 'src/entities/DeliveryLine';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async getById(deliveryFK: number): Promise<Delivery> {
    return await this.deliveryRepository.findOne(deliveryFK);
  }

  async getLast(): Promise<Delivery> {
    const delivers = await this.deliveryRepository.find();
    return delivers[delivers.length - 1];
  }

  async create(date: Date): Promise<Delivery> {
    return await this.deliveryRepository.save({ date });
  }

  async getAllBetweenPeriod(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeliveryLine[]> {
    const delivery = await this.deliveryRepository.find({
      where: {
        date: Raw((date) => `${date} >= :dateStart AND ${date} <= :dateEnd`, {
          dateStart,
          dateEnd,
        }),
      },
      relations: ['deliveryLines'],
    });
    const deliveryLines = [];
    for (const line of delivery) {
      deliveryLines.push(...line.deliveryLines);
    }
    return deliveryLines;
  }
}
