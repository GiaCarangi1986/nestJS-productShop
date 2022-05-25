import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from 'src/entities/Manufacturer';
import { FiltersQS } from './dto/findAll-manufacturer.dto';
import {
  CreateManufacturerCheckDto,
  CreateManufacturerDBDto,
  CreateManufacturerDto,
} from './dto/create-manufacturer.dto';

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

  async createUpdateCheck(title: string) {
    const sameManufacturer = await this.manufacturerRepository.findOne({
      where: { title },
    });
    if (sameManufacturer) {
      throw {
        message: `Производитель с таким наименованием уже существует`,
      };
    }
  }

  async create(manufacturerData: CreateManufacturerDto) {
    await this.createUpdateCheck(manufacturerData.title.toLowerCase());

    const manufacturerCreate: CreateManufacturerDBDto = {
      title: manufacturerData.title.toLowerCase(),
      isDelete: false,
    };
    const category = await this.manufacturerRepository.save(manufacturerCreate);

    for (const productId of manufacturerData.productsID) {
      await this.productService.updateManufacturer(productId, category);
    }

    return this.findAll();
  }

  async getManufacturerData(id: number) {
    const manufacturer = await this.manufacturerRepository.findOne(id);
    if (!manufacturer) {
      throw {
        message: `Нет данных о производителе с id = ${id}`,
      };
    }
    const productList = await this.productService.getAllWithManufacturer(
      manufacturer,
    );
    const serProductList = [];
    for (const item of productList) {
      serProductList.push({
        id: item.id,
        title: item.title,
      });
    }

    return {
      id,
      title: manufacturer.title,
      productList: serProductList,
    };
  }

  async update(id: number, manufacturerData: CreateManufacturerDto) {
    await this.createUpdateCheck(manufacturerData.title.toLowerCase());

    const manufacturerUpdate: CreateManufacturerDBDto = {
      title: manufacturerData.title,
      isDelete: false,
    };
    await this.manufacturerRepository.update(id, manufacturerUpdate);
    const manufacturer = await this.manufacturerRepository.findOne(id);

    const products = await this.productService.getAllProducts();

    for (const product of products) {
      if (product.manufacturerFK?.id === manufacturer.id) {
        await this.productService.updateManufacturer(product.id, null);
      }
      for (const productId of manufacturerData.productsID) {
        if (productId === product.id) {
          await this.productService.updateManufacturer(productId, manufacturer);
        }
      }
    }

    return this.findAll();
  }

  async delete(id: number) {
    const manufacturer = await this.manufacturerRepository.findOne(id);
    if (!manufacturer) {
      throw {
        message: `Нет данных о производителе с id = ${id}`,
      };
    }
    const products = await this.productService.getAllWithManufacturer(
      manufacturer,
    );

    for (const product of products) {
      await this.productService.updateManufacturer(product.id, null);
    }

    await this.manufacturerRepository.update(id, { isDelete: true });
    return this.findAll();
  }

  async getAllForSelect() {
    const manufacturers = await this.manufacturerRepository.find({
      order: { title: 'ASC' },
      where: { isDelete: false },
    });
    const serData = [];
    for (const manufacturer of manufacturers) {
      serData.push({
        id: manufacturer.id,
        title: manufacturer.title,
      });
    }
    return serData;
  }
}
