export class CreateTableCheckDto {
  readonly bonusCount: number;
  readonly bonusCardId: number;
  readonly changedCheck: boolean;
  readonly dateTime: Date | null;
  readonly userId: number;
  readonly paid: boolean;
  readonly parentCheckId: number | null;
  readonly totalSum: number;
}