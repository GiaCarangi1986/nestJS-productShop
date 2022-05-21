export class CreateCatogoryCheckDto {
  readonly id: number;
  readonly productsID: number[];
}

export class CreateCategoryDto {
  readonly title: string;
  readonly productsID: number[];
}

export class CreateCategoryDBDto {
  readonly title: string;
  readonly isDelete: boolean;
}
