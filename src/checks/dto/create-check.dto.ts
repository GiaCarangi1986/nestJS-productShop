import { CheckTableLineCreateDto } from 'src/checkLines/dto/createTable-checkLine.dto';

export class CreateCheckDto {
  readonly bonusCount: number;
  readonly bonusCardFK: number | null;
  readonly changedCheck: boolean;
  readonly dateTime: Date | null;
  readonly userFK: number;
  readonly checkLines: Array<CheckTableLineCreateDto>;
  readonly paid: boolean;
  readonly parentCheckId: number | null;
  readonly totalSum: number;
}
