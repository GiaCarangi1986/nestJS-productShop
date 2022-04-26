import { Product } from 'src/entities/Product';
import { Delivery } from 'src/entities/Delivery';

export class CreateDeliveryLineDBDto {
  readonly productCount: number;
  readonly priceBuy: number;
  readonly productFK: Product;
  readonly deliveryFK: Delivery;
}

class DeliveryLineOne {
  readonly productCount: number;
  readonly priceBuy: number;
  readonly productFK: number;
}

export class CreateDeliveryLineDto {
  readonly deliveryLines: DeliveryLineOne[];
  readonly date: Date;
}
