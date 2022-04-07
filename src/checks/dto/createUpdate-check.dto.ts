type ChecklLine = {
  readonly count: number;
  readonly id: number;
  readonly old_product: boolean;
  readonly price: number;
};

export class CreateOrUpdateCheckDto {
  readonly bonus_count: number;
  readonly cardId: number;
  readonly changedCheck: false;
  readonly date_time: Date;
  readonly kassirId: number;
  readonly linesCheckList: Array<ChecklLine>;
  readonly paid: boolean;
  readonly parentCheckId: number | null;
  readonly totalCost: number;
}

// вполне возможно переименовать поля
