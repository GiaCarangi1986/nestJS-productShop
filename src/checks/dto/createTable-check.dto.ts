import { User } from 'src/entities/User';
import { BonusCard } from 'src/entities/BonusCard';

export class CreateTableCheckDto {
  readonly bonusCount: number;
  readonly bonusCardFK: BonusCard | null;
  readonly changedCheck: boolean;
  readonly dateTime: Date | null;
  readonly userFK: User;
  readonly paid: boolean;
  readonly parentCheckId: null; // сначала создадим обычный чек, а потом если у него стоит changedCheck=true, то обновим предыдущий
  readonly totalSum: number;
}

// на фронте передать в таком случае id старого чека, иначе тупо не найду
