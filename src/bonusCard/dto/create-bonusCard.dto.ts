import { Gender } from 'src/entities/Gender';
import { BonusCardOwner } from 'src/entities/BonusCardOwner';

export class CreateBonusCardOwnerDto {
  readonly FIO: string;
  readonly phone: string;
  readonly email: string | null;
  readonly birthDate: Date;
  readonly genderFK: number;
}

export class CreateBonusCardOwnerDBDto {
  readonly fio: string;
  readonly phone: string;
  readonly email: string | null;
  readonly birthDate: Date;
  readonly genderFK: Gender;
}

export class CreateBonusCardDBDto {
  readonly bonusCount: number;
  readonly active: boolean;
  readonly bonusCardOwnerFK: BonusCardOwner;
}
