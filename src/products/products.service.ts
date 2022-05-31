import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Not, Repository } from 'typeorm';
import { Product } from 'src/entities/Product';
import { UpdateCountProductDto } from './dto/updateCount-product.dto';

import { CheckService } from 'src/checks/check.service';

import { GetBestSellersDtoQS } from 'src/users/dto/getBestSellers-users.dto';

import { Sale } from 'src/entities/Sale';
import { Category } from 'src/entities/Category';
import { MeasurementUnits } from 'src/entities/MeasurementUnits';
import { Manufacturer } from 'src/entities/Manufacturer';
import { FiltersQS } from './dto/findAll-product.dto';
import { CreateProductDBDto, CreateProductDto } from './dto/create-product.dto';

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

  async getAllTitles(): Promise<Product[]> {
    return this.productsRepository.find({
      order: { title: 'ASC' },
      where: { isArchive: false },
    });
  }

  async getAllSales() {
    const products = await this.productsRepository.find({
      where: { isArchive: false },
    });
    const serProducts = [];
    for (const product of products) {
      serProducts.push({
        id: product.id,
        saleFK: product.saleFK,
      });
    }
    return serProducts;
  }

  async getAllProducts() {
    return this.productsRepository.find({ where: { isArchive: false } });
  }

  async getAllWithSale(sale: Sale): Promise<Product[]> {
    return this.productsRepository.find({
      where: { saleFK: sale, isArchive: false },
      order: { title: 'ASC' },
    });
  }

  async getAllWithManufacturer(manufacturer: Manufacturer): Promise<Product[]> {
    return this.productsRepository.find({
      where: { manufacturerFK: manufacturer, isArchive: false },
      order: { title: 'ASC' },
    });
  }

  async getAllWithCategory(category: Category): Promise<Product[]> {
    return this.productsRepository.find({
      where: { categoryFK: category, isArchive: false },
      order: { title: 'ASC' },
    });
  }

  async updateSale(id: number, value: null | Sale) {
    await this.productsRepository.update(id, { saleFK: value });
  }

  async archive(id: number) {
    await this.productsRepository.update(id, { isArchive: true });
  }

  async updateCategory(id: number, value: Category) {
    await this.productsRepository.update(id, { categoryFK: value });
  }

  async updateManufacturer(id: number, value: null | Manufacturer) {
    await this.productsRepository.update(id, { manufacturerFK: value });
  }

  async updateCount(id: number, count: number) {
    return this.productsRepository.update(id, { count });
  }

  async deleteSaleFK(products: Product[]) {
    for (const product of products) {
      const endTime = product.saleFK?.dateEnd
        ? new Date(product.saleFK?.dateEnd).getTime()
        : null;
      const nowDayDate = new Date();
      nowDayDate.setHours(3, 0, 0, 0);
      if (endTime && endTime < nowDayDate.getTime()) {
        product.saleFK = null;
        await this.productsRepository.update(product.id, {
          saleFK: product.saleFK,
        });
      }
    }
    return products;
  }

  async findAllByTitle() {
    return this.productsRepository.find({
      order: { title: 'ASC' },
      where: { isArchive: false },
    });
  }

  async getAll(): Promise<Product[]> {
    let products = await this.findAllByTitle();
    products = await this.deleteSaleFK(products);

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
      where: { isArchive: false },
    });
    const serProducts = [];
    for (const product of products) {
      serProducts.push({
        id: product.id,
        title: product.title,
        category: product.categoryFK.title,
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

    const products = await this.productsRepository.find({
      where: { isArchive: false },
    });
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

  async findAllCRUD(queryParams?: FiltersQS): Promise<Product[]> {
    const search = queryParams?.search ? queryParams.search : '';

    const data = await this.productsRepository
      .createQueryBuilder('Product')
      .leftJoinAndSelect('Product.categoryFK', 'Category')
      .leftJoinAndSelect('Product.measurementUnitsFK', 'MeasurementUnits')
      .leftJoinAndSelect('Product.saleFK', 'Sale')
      .leftJoinAndSelect('Product.manufacturerFK', 'Manufacturer')
      .where(
        `(CONVERT(VARCHAR(20), Product.id) LIKE :id
          OR LOWER(Product.title) LIKE :title
          OR CONVERT(VARCHAR(20), Product.priceNow) LIKE :priceNow
          OR CONVERT(VARCHAR(20), Product.count) LIKE :count
          OR CONVERT(VARCHAR(20), Product.expirationDate) LIKE :expirationDate
          OR LOWER(Category.title) LIKE :titleCategory
          OR LOWER(MeasurementUnits.title) LIKE :titleMeasurementUnits
          OR CONVERT(VARCHAR(20), Sale.id) LIKE :idSale
          OR LOWER(Manufacturer.title) LIKE :titleManufacturer)`,
        {
          id: `%${search}%`,
          title: `%${search.toLowerCase()}%`,
          priceNow: `%${search}%`,
          count: `%${search}%`,
          expirationDate: `%${search}%`,
          titleCategory: `%${search.toLowerCase()}%`,
          titleMeasurementUnits: `%${search.toLowerCase()}%`,
          idSale: `%${search}%`,
          titleManufacturer: `%${search.toLowerCase()}%`,
        },
      )
      .andWhere('Product.isArchive = :isArchive', { isArchive: false })
      .orderBy('Product.title', 'ASC')
      .getMany();

    const serData = [];
    for (const product of data) {
      serData.push({
        id: product.id,
        title: product.title,
        priceNow: product.priceNow,
        count: product.count,
        expirationDate: product.expirationDate,
        category: product.categoryFK.title,
        manufacturer: product.manufacturerFK?.title,
        measurementUnits: product.measurementUnitsFK.title,
        sale: product.saleFK?.id,
      });
    }
    return serData;
  }

  async createUpdateCheck(
    title: string,
    categoryId: number,
    manufacturerId: number,
    measurementUnitsId: number,
    id?: number,
  ) {
    const categoryRep = getRepository(Category);
    const category = await categoryRep.findOne(categoryId);

    const manufacturerRep = getRepository(Manufacturer);
    const manufacturer = manufacturerId
      ? await manufacturerRep.findOne(manufacturerId)
      : null;

    const measurementUnitsRep = getRepository(MeasurementUnits);
    const measurementUnits = await measurementUnitsRep.findOne(
      measurementUnitsId,
    );

    const where = id
      ? {
          id: Not(id),
          title,
          categoryFK: category,
          manufacturerFK: manufacturer,
          measurementUnitsFK: measurementUnits,
        }
      : {
          title,
          categoryFK: category,
          manufacturerFK: manufacturer,
          measurementUnitsFK: measurementUnits,
        };

    const sameProduct = await this.productsRepository.findOne({
      where,
    });
    if (sameProduct) {
      throw {
        message: `Продукт с таким названием, категорией, прозводителем и ед. измер. уже существует`,
      };
    }
    return {
      category,
      manufacturer,
      measurementUnits,
    };
  }

  async create(productData: CreateProductDto) {
    const data = await this.createUpdateCheck(
      productData.title.toLowerCase(),
      productData.categoryFK,
      productData.manufacturerFK,
      productData.measurementUnitsFK,
    );

    const productCreate: CreateProductDBDto = {
      title: productData.title.toLowerCase(),
      priceNow: productData.priceNow,
      count: 0,
      expirationDate: productData.expirationDate,
      maybeOld: productData.maybeOld,
      categoryFK: data.category,
      manufacturerFK: data.manufacturer,
      measurementUnitsFK: data.measurementUnits,
      isArchive: false,
      saleFK: null,
    };
    await this.productsRepository.save(productCreate);
    return this.findAllCRUD();
  }

  async delete(id: number) {
    const data = await this.productsRepository.findOne(id);
    if (!data) {
      throw {
        message: `Нет данных о товаре с id = ${id}`,
      };
    }
    await this.productsRepository.update(id, { isArchive: true, saleFK: null });
    return this.findAllCRUD();
  }

  async getProductData(id: number) {
    const data = await this.productsRepository.findOne(id);
    if (!data) {
      throw {
        message: `Нет данных о продукте с id = ${id}`,
      };
    }

    const categoryRep = getRepository(Category);
    const category = await categoryRep.findOne(data.categoryFK);

    const manufacturerRep = getRepository(Manufacturer);
    const manufacturer = await manufacturerRep.findOne(data.manufacturerFK);

    const measurementUnitsRep = getRepository(MeasurementUnits);
    const measurementUnits = await measurementUnitsRep.findOne(
      data.measurementUnitsFK,
    );

    return {
      id: data.id,
      title: data.title,
      priceNow: data.priceNow,
      maybeOld: data.maybeOld,
      category: {
        id: category.id,
        title: category.title,
      },
      manufacturer: {
        id: manufacturer?.id,
        title: manufacturer?.title,
      },
      measurementUnits: {
        id: measurementUnits?.id,
        title: measurementUnits?.title,
      },
      expirationDate: data.expirationDate,
    };
  }

  async updateAllData(id: number, productData: CreateProductDto) {
    const data = await this.createUpdateCheck(
      productData.title.toLowerCase(),
      productData.categoryFK,
      productData.manufacturerFK,
      productData.measurementUnitsFK,
      id,
    );

    await this.productsRepository.update(id, {
      title: productData.title.toLowerCase(),
      priceNow: productData.priceNow,
      expirationDate: productData.expirationDate,
      maybeOld: productData.maybeOld,
      categoryFK: data.category,
      manufacturerFK: data.manufacturer,
      measurementUnitsFK: data.measurementUnits,
    });
    return this.findAllCRUD();
  }
}
