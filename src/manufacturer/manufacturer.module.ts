import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerService } from './manufacturer.service';
import { Manufacturer } from 'src/entities/Manufacturer';
import {
  ManufacturerCRUDController,
  ManufacturerCheckController,
  ManufacturerSelectController,
} from './manufacturer.controller';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer]), ProductsModule],
  providers: [ManufacturerService],
  controllers: [
    ManufacturerCRUDController,
    ManufacturerCheckController,
    ManufacturerSelectController,
  ],
})
export class ManufacturerModule {}
