import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/Category';
import { FiltersQS } from './dto/findAll-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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
}
