import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateCheckDto } from './dto/createUpdate-check.dto';
import { Check } from '../entities/Check';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>,
  ) {}

  async getAll(): Promise<Check[]> {
    return this.checkRepository.find();
  }

  async create(product: CreateOrUpdateCheckDto) {
    // const newProduct = new this.products(product)
    return product;
  }
}
