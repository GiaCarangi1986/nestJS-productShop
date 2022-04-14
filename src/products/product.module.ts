import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { Product } from 'src/entities/Product';
import { DeliveryLineModule } from 'src/deliveryLine/deliveryLine.module';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), DeliveryLineModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductsModule {}
