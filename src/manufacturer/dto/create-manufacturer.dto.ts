export class CreateManufacturerCheckDto {
  readonly id: number;
  readonly productsID: number[];
}

export class CreateManufacturerDto {
  readonly title: string;
  readonly productsID: number[];
}

export class CreateManufacturerDBDto {
  readonly title: string;
  readonly isDelete: boolean;
}
