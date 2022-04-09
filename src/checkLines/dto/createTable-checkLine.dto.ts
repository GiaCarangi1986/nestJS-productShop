import { Product } from '../../entities/Product';

export class CheckTableLineCreateDto {
  readonly productCount: number;
  readonly productFK: Product;
  readonly oldProduct: boolean;
  readonly price: number;
}
