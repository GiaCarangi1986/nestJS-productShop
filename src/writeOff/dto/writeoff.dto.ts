import { User } from 'src/entities/User';
import { Product } from 'src/entities/Product';

class WriteOffProduct {
  productFK: number;
  productCount: number;
}

export class WriteOffDto {
  productList: WriteOffProduct[];
  dateTimeWriteOff: Date;
  userFK: number;
}

export class WriteOffDBDto {
  id?: number;
  productCount: number;
  dateTimeWriteOff: Date;
  userFK: User;
  productFK: Product;
}
