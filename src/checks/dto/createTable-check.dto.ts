import { User } from 'src/entities/User';
import { BonusCard } from 'src/entities/BonusCard';
import { Check } from 'src/entities/Check';

export class CreateTableCheckDto {
  bonusCount: number;
  bonusCardFK: BonusCard | null;
  changedCheck: boolean;
  dateTime: Date | null;
  userFK: User;
  paid: boolean;
  parentCheckId: Check | null;
  totalSum: number;
}
