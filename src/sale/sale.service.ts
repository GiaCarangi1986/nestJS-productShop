import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from 'src/entities/Sale';

import { ProductService } from 'src/products/products.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private readonly productService: ProductService,
  ) {}

  async findAll() {
    const productData = await this.productService.findForSale();
    const saleData = await this.saleRepository.find({
      order: { id: 'DESC' },
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
