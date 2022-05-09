export class CreateSaleDBDto {
  readonly dateStart: Date;
  readonly dateEnd: Date;
  readonly discountPercent: number;
}

export class CreateSaleDto {
  readonly dateStart: Date;
  readonly dateEnd: Date;
  readonly discountPercent: number;
  readonly productsID: number[];
}

export class CreateSaleCheckDto {
  readonly productsID: number[];
}
