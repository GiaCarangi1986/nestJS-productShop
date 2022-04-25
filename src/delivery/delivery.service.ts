import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from 'src/entities/Delivery';

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
}
