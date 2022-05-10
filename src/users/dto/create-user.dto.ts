import { Role } from 'src/entities/Role';

export class UserDto {
  readonly FIO: string;
  readonly phone: string;
  readonly email: string | null;
  readonly password: string;
  readonly roleFK: number;
}

export class UserDBDto {
  readonly fio: string;
  readonly phone: string;
  readonly email: string | null;
  readonly password: string;
  readonly roleFK: Role;
  readonly isDelete: boolean;
}
