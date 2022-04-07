import { ChecklLineCreateDto } from 'src/checkLines/dto/create-checkLine.dto';

export class CreateCheckDto {
  readonly bonusCount: number;
  readonly bonusCardId: number;
  readonly changedCheck: false;
  readonly dateTime: Date;
  readonly userId: number;
  readonly checkLines: Array<ChecklLineCreateDto>;
  readonly paid: boolean;
  readonly parentCheck: number | null;
  readonly totalSum: number;
}

// вполне возможно переименовать поля
