import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private products: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.products.find();
  }

  async create(product: CreateProductDto) {
    return `${product.price}, ${product.title}`;
  }
}
