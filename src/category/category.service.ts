import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Category } from 'src/entities/Category';
import { FiltersQS } from './dto/findAll-category.dto';
import {
  CreateCategoryDBDto,
  CreateCategoryDto,
  CreateCatogoryCheckDto,
} from './dto/create-category.dto';

import { ProductService } from 'src/products/products.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly productService: ProductService,
  ) {}

  async findAll(queryParams?: FiltersQS): Promise<Category[]> {
    const search = queryParams?.search ? queryParams.search : '';

    const data = await this.categoryRepository
      .createQueryBuilder('Category')
      .where(
        `(CONVERT(VARCHAR(20), Category.id) LIKE :id
      OR LOWER(Category.title) LIKE :title)`,
        {
          id: `%${search}%`,
          title: `%${search.toLowerCase()}%`,
        },
      )
      .andWhere('Category.isDelete = :isDelete', { isDelete: false })
      .orderBy('Category.title', 'ASC')
      .getMany();

    return data;
  }

  async createCheck(categoryData: CreateCatogoryCheckDto) {
    const category = await this.categoryRepository.findOne(categoryData.id);
    const checkProduct = [];
    const productList = await this.productService.getAllTitles();
    for (const product of productList) {
      for (const productId of categoryData.productsID) {
        if (
          productId === product.id &&
          product.categoryFK.id !== category?.id
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

  async createCheckDelete(id: number) {
    const category = await this.categoryRepository.findOne(id, {
      relations: ['products'],
    });
    const checkProduct = [];

    for (const product of category.products) {
      checkProduct.push({
        id: product.id,
        title: product.title,
      });
    }

    return checkProduct;
  }

  async createUpdateCheck(title: string, id?: number) {
    const where = id
      ? {
          id: Not(id),
          title,
        }
      : {
          title,
        };

    const sameCategory = await this.categoryRepository.findOne({
      where,
    });
    if (sameCategory) {
      throw {
        message: `?????????????????? ?? ?????????? ?????????????????????????? ?????? ????????????????????`,
      };
    }
  }

  async create(categoryData: CreateCategoryDto) {
    await this.createUpdateCheck(categoryData.title.toLowerCase());

    const categoryCreate: CreateCategoryDBDto = {
      title: categoryData.title.toLowerCase(),
      isDelete: false,
    };
    const category = await this.categoryRepository.save(categoryCreate);

    for (const productId of categoryData.productsID) {
      await this.productService.updateCategory(productId, category);
    }

    return this.findAll();
  }

  async delete(id: number) {
    const category = await this.categoryRepository.findOne(id, {
      relations: ['products'],
    });
    if (!category) {
      throw {
        message: `?????? ???????????? ?? ?????????????????? ?? id = ${id}`,
      };
    }

    for (const product of category.products) {
      await this.productService.archive(product.id);
    }

    await this.categoryRepository.update(id, { isDelete: true });
    return this.findAll();
  }

  async getCategoryData(id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw {
        message: `?????? ???????????? ?? ?????????????????? ?? id = ${id}`,
      };
    }
    const productList = await this.productService.getAllWithCategory(category);
    const serProductList = [];
    for (const item of productList) {
      serProductList.push({
        id: item.id,
        title: item.title,
      });
    }

    return {
      id,
      title: category.title,
      productList: serProductList,
    };
  }

  async update(id: number, categoryData: CreateCategoryDto) {
    await this.createUpdateCheck(categoryData.title.toLowerCase(), id);

    const categoryUpdate: CreateCategoryDBDto = {
      title: categoryData.title,
      isDelete: false,
    };
    await this.categoryRepository.update(id, categoryUpdate);
    const category = await this.categoryRepository.findOne(id);

    const products = await this.productService.getAllProducts();

    for (const product of products) {
      for (const productId of categoryData.productsID) {
        if (productId === product.id) {
          await this.productService.updateCategory(productId, category);
        }
      }
    }

    return this.findAll();
  }

  async getAllForSelect() {
    const categories = await this.categoryRepository.find({
      order: { title: 'ASC' },
      where: { isDelete: false },
    });
    const serData = [];
    for (const category of categories) {
      serData.push({
        id: category.id,
        title: category.title,
      });
    }
    return serData;
  }
}
