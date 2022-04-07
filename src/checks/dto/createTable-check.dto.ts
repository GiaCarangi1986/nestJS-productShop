export class CreateTableCheckDto {
  readonly bonusCount: number;
  readonly bonusCardId: number;
  readonly changedCheck: false;
  readonly dateTime: Date;
  readonly userId: number;
  readonly paid: boolean;
  readonly parentCheckId: number | null;
  readonly totalSum: number;
}
