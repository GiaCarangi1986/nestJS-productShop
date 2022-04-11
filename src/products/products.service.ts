import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/Product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private products: Repository<Product>,
  ) {}

  async getAllById(id: number): Promise<Product[]> {
    return this.products.find({ where: { id } });
  }
}
