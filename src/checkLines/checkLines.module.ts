import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckLineService } from './checkLines.service';
import { RevenueController } from './checkLines.controller';
import { CheckLine } from 'src/entities/CheckLine';
import { CheckModule } from 'src/checks/check.module';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckLine]),
    DeliveryModule,
    forwardRef(() => CheckModule),
    forwardRef(() => ProductsModule),
  ],
  providers: [CheckLineService],
  controllers: [RevenueController],
  exports: [CheckLineService],
})
export class CheckLineModule {}
