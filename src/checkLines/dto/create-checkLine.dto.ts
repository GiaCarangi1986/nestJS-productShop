import { Product } from '../../entities/Product';
import { Check } from '../../entities/Check';

export class CheckLineCreateDto {
  readonly productCount: number;
  readonly productFK: Product;
  readonly oldProduct: boolean;
  readonly price: number;
  checkFK: Check; // id, который вернется после создания чека
}
