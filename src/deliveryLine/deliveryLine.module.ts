import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryLine } from '../entities/DeliveryLine';
import { DeliveryLineService } from './deliveryLine.service';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { DeliveryLineController } from './deliveryLine.controller';
import { ProductsModule } from 'src/products/product.module';
import { CheckModule } from 'src/checks/check.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryLine]),
    DeliveryModule,
    ProductsModule,
    CheckModule,
  ],
  providers: [DeliveryLineService],
  controllers: [DeliveryLineController],
  exports: [DeliveryLineService],
})
export class DeliveryLineModule {}
