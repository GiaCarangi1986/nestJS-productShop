import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryLine } from '../entities/DeliveryLine';
import { DeliveryLineService } from './deliveryLine.service';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryLine]),
    DeliveryModule,
    ProductsModule,
  ],
  providers: [DeliveryLineService],
  controllers: [],
  exports: [DeliveryLineService],
})
export class DeliveryLineModule {}
