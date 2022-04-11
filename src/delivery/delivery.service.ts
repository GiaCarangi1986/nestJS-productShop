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
}
