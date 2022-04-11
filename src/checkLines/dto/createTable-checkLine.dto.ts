import { Product } from '../../entities/Product';
import { Check } from '../../entities/Check';

export class CheckTableLineCreateDto {
  readonly productCount: number;
  readonly productFK: Product;
  readonly oldProduct: boolean;
  readonly price: number;
  readonly id: number;
  readonly checkFK: Check;
}
