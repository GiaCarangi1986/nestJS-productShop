export class ChecklLineCreateDto {
  readonly productCount: number;
  readonly productId: number;
  readonly oldProduct: boolean;
  readonly price: number;
  checkId: number; // id, который вернется после создания чека
}
