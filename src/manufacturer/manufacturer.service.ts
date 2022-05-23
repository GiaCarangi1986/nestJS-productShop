import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from 'src/entities/Manufacturer';
import { FiltersQS } from './dto/findAll-manufacturer.dto';
import { CreateManufacturerCheckDto } from './dto/create-manufacturer.dto';

import { ProductService } from 'src/products/products.service';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
    private readonly productService: ProductService,
  ) {}

  async findAll(queryParams?: FiltersQS): Promise<Manufacturer[]> {
    const search = queryParams?.search ? queryParams.search : '';

    const data = await this.manufacturerRepository
      .createQueryBuilder('Manufacturer')
      .where(
        `(CONVERT(VARCHAR(20), Manufacturer.id) LIKE :id
      OR LOWER(Manufacturer.title) LIKE :title)`,
        {
          id: `%${search}%`,
          title: `%${search.toLowerCase()}%`,
        },
      )
      .andWhere('Manufacturer.isDelete = :isDelete', { isDelete: false })
      .orderBy('Manufacturer.title', 'ASC')
      .getMany();

    return data;
  }

  async createCheck(manufacturerData: CreateManufacturerCheckDto) {
    const manufacturer = await this.manufacturerRepository.findOne(
      manufacturerData.id,
    );
    const checkProduct = [];
    const productList = await this.productService.getAllTitles();
    for (const product of productList) {
      for (const productId of manufacturerData.productsID) {
        if (
          productId === product.id &&
          product.manufacturerFK?.id &&
          product.manufacturerFK?.id !== manufacturer?.id
        ) {
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
}
