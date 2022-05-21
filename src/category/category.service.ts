import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/Category';
import { FiltersQS } from './dto/findAll-category.dto';
import { CreateCatogoryCheckDto } from './dto/createCheck-category';

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
}
