import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/Product';
import { UpdateCountProductDto } from './dto/updateCount-product.dto';

import { CheckService } from 'src/checks/check.service';

import { GetBestSellersDtoQS } from 'src/users/dto/getBestSellers-users.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @Inject(forwardRef(() => CheckService))
    private checkService: CheckService,
  ) {}

  async getById(id: number): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  async updateCount(id: number, count: number) {
    return this.productsRepository.update(id, { count });
  }

  async getAll(): Promise<Product[]> {
    const products = await this.productsRepository.find({
      order: { title: 'ASC' },
    });
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

  getRandomInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round((Math.random() * (max - min + 1) + min) * 100) / 100;
  }

  async getAllForMakeDelivery() {
    const products = await this.productsRepository.find({
      order: {
        title: 'ASC',
      },
    });
    const serProducts = [];
    for (const product of products) {
      serProducts.push({
        id: product.id,
        title: product.title,
        manufacturer: product.manufacturerFK?.title || '',
        unit: product.measurementUnitsFK.title,
        count: -1 * product.count,
        price: this.getRandomInclusive(
          product.priceNow * 0.55,
          product.priceNow * 0.95,
        ),
        expirationDate: product.expirationDate,
      });
    }
    return serProducts;
  }

  async getAllForRevenueData() {
    const products = await this.productsRepository.find();
    const serProducts = [];
    for (const product of products) {
      serProducts.push({
        id: product.id,
        count: 0,
        cost: 0,
        averageCost: 0,
      });
    }
    return serProducts;
  }

  async deltaCount(id: number, deltaCount: number, action?: string) {
    const productOld = await this.productsRepository.findOne(id);

    if (!productOld) {
      throw {
        message: `Не существует продукта с id = ${id}`,
      };
    }

    const delta = productOld.count - deltaCount;
    if (delta < 0) {
      throw {
        message: `Можно ${action || 'купить'} максимум ${
          productOld.count
        } шт/кг для '${productOld.title}'`,
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

  async getBestSellers({ dateStart, dateEnd }: GetBestSellersDtoQS) {
    const checkLines = await this.checkService.getAllBetweenPeriod(
      dateStart,
      dateEnd,
    );

    const products = await this.productsRepository.find();
    const serProducts = [];
    for (const product of products) {
      serProducts.push({
        title: product.title,
        countOfSale: 0,
        manufacturer: product.manufacturerFK?.title,
        id: product.id,
        category: product.categoryFK.title,
      });
    }

    for (const checkLine of checkLines) {
      for (const serProduct of serProducts) {
        if (checkLine.productFK.id === serProduct.id) {
          serProduct.countOfSale += checkLine.productCount;
        }
      }
    }

    const sortProducts = serProducts.sort(function (a, b) {
      if (a.countOfSale > b.countOfSale) {
        return -1;
      }
      if (a.countOfSale < b.countOfSale) {
        return 1;
      }
      return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
    });

    return sortProducts;
  }
}
