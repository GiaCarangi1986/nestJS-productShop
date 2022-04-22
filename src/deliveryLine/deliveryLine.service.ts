import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLine } from 'src/entities/DeliveryLine';

@Injectable()
export class DeliveryLineService {
  constructor(
    @InjectRepository(DeliveryLine)
    private deliveryLineRepository: Repository<DeliveryLine>,
  ) {}
}
