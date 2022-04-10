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
  parentCheckId: Check | null; // сначала создадим обычный чек, а потом если у него стоит changedCheck=true, то обновим предыдущий
  totalSum: number;
}

// на фронте передать в таком случае id старого чека, иначе тупо не найду
