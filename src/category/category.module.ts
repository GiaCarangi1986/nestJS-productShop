import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/Category';
import { CategoryCRUDController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  controllers: [CategoryCRUDController],
})
export class CategoryModule {}
