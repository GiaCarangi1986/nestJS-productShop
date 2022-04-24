import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/Product';
import { UpdateCountProductDto } from './dto/updateCount-product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getById(id: number): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  async updateCount(id: number, count: number) {
    return this.productsRepository.update(id, { count });
  }

  async getAll() {
    const products = await this.productsRepository.find();
    const serProducts = [];
    for (const product of products) {
      serProducts.push({
        id: product.id,
        title: product.title,
        manufacturer: product.manufacturerFK?.title || '',
        unit: product.measurementUnitsFK.title,
        count: product.count,
        price: product.saleFK
          ? product.priceNow -
            product.priceNow * (product.saleFK.discountPercent / 100)
          : product.priceNow,
        sale: product.saleFK?.id ? true : false,
        maybeOld: product.maybeOld,
      });
    }
    return serProducts;
  }

  async deltaCount(id: number, deltaCount: number) {
    const productOld = await this.productsRepository.findOne(id);

    if (!productOld) {
      throw {
        message: `Не существует продукта с id = ${id}`,
      };
    }

    const delta = productOld.count - deltaCount;
    if (delta < 0) {
      throw {
        message: `Можно купить максимум ${productOld.count} шт/кг для '${productOld.title}'`,
      };
    }

    return {
      id: productOld.id,
      deltaCount: delta,
    };
  }

  async updateArr(products: UpdateCountProductDto[]) {
    for (const product of products) {
      await this.productsRepository.update(product.id, {
        count: product.deltaCount,
      });
    }
  }
}
