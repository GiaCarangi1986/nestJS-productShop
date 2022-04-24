import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { Delivery } from 'src/entities/Delivery';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery])],
  providers: [DeliveryService],
  controllers: [],
  exports: [DeliveryService],
})
export class DeliveryModule {}
