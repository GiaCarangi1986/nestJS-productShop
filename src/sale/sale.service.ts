import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from 'src/entities/Sale';
import {
  CreateSaleDto,
  CreateSaleDBDto,
  CreateSaleCheckDto,
} from './dto/create-sale.dto';

import { ProductService } from 'src/products/products.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private readonly productService: ProductService,
  ) {}

  async delete(id: number) {
    const sale = await this.saleRepository.findOne(id);
    if (!sale) {
      throw {
        message: `Нет данных об акции с id = ${id}`,
      };
    }
    const products = await this.productService.getAllWithSale(sale);

    for (const product of products) {
      await this.productService.updateSale(product.id, null);
    }

    await this.saleRepository.delete(id);
    return this.findAll();
  }

  async createCheck(saleData: CreateSaleCheckDto) {
    const checkProduct = [];
    const productList = await this.productService.getAllTitles();
    for (const product of productList) {
      for (const productId of saleData.productsID) {
        if (productId === product.id && product.saleFK) {
          checkProduct.push({
            id: productId,
            title: product.title,
          });
          break;
        }
      }
    }

    return checkProduct;
  }

  async create(saleData: CreateSaleDto) {
    const saleCreate: CreateSaleDBDto = {
      dateStart: saleData.dateStart,
      dateEnd: saleData.dateEnd,
      discountPercent: saleData.discountPercent,
    };
    const sale = await this.saleRepository.save(saleCreate);

    for (const productId of saleData.productsID) {
      await this.productService.updateSale(productId, sale);
    }

    return this.findAll();
  }

  async findAll() {
    const productData = await this.productService.findForSale();
    const saleData = await this.saleRepository.find({
      order: { dateStart: 'ASC', dateEnd: 'ASC', id: 'ASC' },
    });

    const serSaleList = [];
    for (const sale of saleData) {
      let productCount = 0;
      for (const product of productData) {
        if (product.saleFK?.id === sale.id) {
          productCount++;
        }
      }
      serSaleList.push({
        id: sale.id,
        dateStart: sale.dateStart,
        dateEnd: sale.dateEnd,
        discountPercent: sale.discountPercent,
        productCount,
      });
    }

    return serSaleList;
  }
}
