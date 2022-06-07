export class CreateCheck {
  id: number;
  title: string;
}

export class GetManufacturerData extends CreateCheck {
  productList: CreateCheck[];
}
