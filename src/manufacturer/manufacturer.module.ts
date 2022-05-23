import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerService } from './manufacturer.service';
import { Manufacturer } from 'src/entities/Manufacturer';
import { ManufacturerCRUDController } from './manufacturer.controller';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer]), ProductsModule],
  providers: [ManufacturerService],
  controllers: [ManufacturerCRUDController],
})
export class ManufacturerModule {}
