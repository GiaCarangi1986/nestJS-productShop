import { CheckLineCreateDto } from 'src/checkLines/dto/create-checkLine.dto';
import { User } from 'src/entities/User';
import { BonusCard } from 'src/entities/BonusCard';
import { Check } from 'src/entities/Check';

export class CreateCheckDto {
  readonly bonusCount: number;
  readonly bonusCardFK: number | null;
  readonly changedCheck: boolean;
  readonly dateTime: Date | null;
  readonly userFK: number;
  readonly checkLines: Array<CheckLineCreateDto>;
  readonly paid: boolean;
  readonly parentCheckId: number | null;
  readonly totalSum: number;
  readonly id?: number;
}

export class CreateTableCheckDto {
  bonusCount: number;
  bonusCardFK: BonusCard | null;
  changedCheck: boolean;
  dateTime: Date | null;
  userFK: User;
  paid: boolean;
  parentCheckId: Check | null;
  totalSum: number;
  isCancelled: boolean;
}
