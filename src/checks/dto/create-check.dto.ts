import { CheckTableLineCreateDto } from 'src/checkLines/dto/createTable-checkLine.dto';

export class CreateCheckDto {
  readonly bonusCount: number;
  readonly bonusCardId: number;
  readonly changedCheck: boolean;
  readonly dateTime: Date;
  readonly userId: number;
  readonly checkLines: Array<CheckTableLineCreateDto>;
  readonly paid: boolean;
  readonly parentCheck: number | null;
  readonly totalSum: number;
}

// вполне возможно переименовать поля
