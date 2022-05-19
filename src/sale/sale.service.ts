import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from 'src/entities/Sale';
import {
  CreateSaleDto,
  CreateSaleDBDto,
  CreateSaleCheckDto,
} from './dto/create-sale.dto';
import { FiltersQS } from './dto/findAll-sale.dto';
import { SALE_KIND_VALUE } from 'src/const';

import { ProductService } from 'src/products/products.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private readonly productService: ProductService,
  ) {}

  async getSaleData(id: number) {
    const sale = await this.saleRepository.findOne(id);
    if (!sale) {
      throw {
        message: `Нет данных об акции с id = ${id}`,
      };
    }
    const productList = await this.productService.getAllWithSale(sale);
    const serProductList = [];
    for (const item of productList) {
      serProductList.push({
        id: item.id,
        title: item.title,
      });
    }

    return {
      id,
      dateStart: sale.dateStart,
      dateEnd: sale.dateEnd,
      discountPercent: sale.discountPercent,
      productList: serProductList,
    };
  }

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
    const sale = await this.saleRepository.findOne(saleData.id);
    const checkProduct = [];
    const productList = await this.productService.getAllTitles();
    for (const product of productList) {
      for (const productId of saleData.productsID) {
        if (productId === product.id && product.saleFK?.id !== sale?.id) {
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

  async update(id: number, saleData: CreateSaleDto) {
    const saleUpdate: CreateSaleDBDto = {
      dateStart: saleData.dateStart,
      dateEnd: saleData.dateEnd,
      discountPercent: saleData.discountPercent,
    };
    await this.saleRepository.update(id, saleUpdate);
    const sale = await this.saleRepository.findOne(id);

    const products = await this.productService.getAllSales();

    for (const product of products) {
      if (product.saleFK?.id === sale.id) {
        await this.productService.updateSale(product.id, null);
      }
      for (const productId of saleData.productsID) {
        if (productId === product.id) {
          await this.productService.updateSale(productId, sale);
        }
      }
    }

    return this.findAll();
  }

  async findAll(queryParams?: FiltersQS) {
    const search = queryParams?.search ? queryParams.search : '';
    const status = queryParams?.status ? queryParams.status : '';
    const date = queryParams?.date ? queryParams.date : '';

    const salePresent =
      status && status === SALE_KIND_VALUE.present
        ? `(Sale.dateStart <= CONVERT(DATE, '${date}') AND Sale.dateEnd >= CONVERT(DATE, '${date}'))`
        : {};
    const saleFuture =
      status && status === SALE_KIND_VALUE.future
        ? `Sale.dateStart >= CONVERT(DATE, '${date}')`
        : {};

    const saleData = await this.saleRepository
      .createQueryBuilder('Sale')
      .where(
        `(CONVERT(VARCHAR(20), Sale.id) LIKE :id
          OR CONVERT(VARCHAR, Sale.dateStart, 104) LIKE :dateStart
          OR CONVERT(VARCHAR, Sale.dateEnd, 104) LIKE :dateEnd
          OR CONVERT(VARCHAR(20), Sale.discountPercent) LIKE :discountPercent)`,
        {
          id: `%${search}%`,
          dateStart: `%${search}%`,
          dateEnd: `%${search}%`,
          discountPercent: `%${search}%`,
        },
      )
      .andWhere(salePresent)
      .andWhere(saleFuture)
      .orderBy('Sale.dateStart', 'ASC')
      .addOrderBy('Sale.dateEnd', 'ASC')
      .addOrderBy('Sale.id', 'ASC')
      .getMany();

    let products = await this.productService.findAllByTitle();
    products = await this.productService.deleteSaleFK(products);

    const serSaleList = [];
    for (const sale of saleData) {
      let productCount = 0;
      for (const product of products) {
        if (product.saleFK?.id === sale.id) {
          productCount++;
        }
      }
      if (!productCount) {
        await this.saleRepository.delete(sale.id);
      } else {
        serSaleList.push({
          id: sale.id,
          dateStart: sale.dateStart,
          dateEnd: sale.dateEnd,
          discountPercent: sale.discountPercent,
          productCount,
        });
      }
    }

    return serSaleList;
  }
}
