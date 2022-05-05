import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleService } from './sale.service';
import { Sale } from 'src/entities/Sale';
import { SaleController } from './sale.controller';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), ProductsModule],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
