import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLineService } from 'src/deliveryLine/deliveryLine.service';
import { Product } from 'src/entities/Product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly deliveryLineService: DeliveryLineService,
  ) {}

  async getAllById(id: number): Promise<Product[]> {
    return this.productsRepository.find({ where: { id } });
  }

  async getAll() {
    const products = await this.productsRepository.find();
    const serProducts = [];
    for (const product of products) {
      const delivLine = await this.deliveryLineService.findByProductFK(
        product.id,
      );
      serProducts.push({
        id: product.id,
        title: product.title,
        manufacturer: product.manufacturerFK?.title || '',
        unit: product.measurementUnitsFK.title,
        count: delivLine.productCount,
        price: product.priceNow,
        sale: product.saleFK?.id ? true : false,
        maybeOld: product.maybeOld,
      });
    }
    return serProducts;
  }
}
