import { Product } from 'src/entities/Product';
import { Delivery } from 'src/entities/Delivery';

export class CreateDeliveryLineDBDto {
  readonly productCount: number;
  readonly priceBuy: number;
  readonly productFK: Product;
  readonly deliveryFK: Delivery;
}
