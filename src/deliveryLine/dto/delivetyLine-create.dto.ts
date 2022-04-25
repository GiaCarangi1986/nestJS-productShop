class DeliveryLineOne {
  readonly productCount: number;
  readonly priceBuy: number;
  readonly productFK: number;
}

export class CreateDeliveryLineDto {
  readonly deliveryLines: DeliveryLineOne[];
  readonly date: Date;
}
