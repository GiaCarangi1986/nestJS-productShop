import { Role } from 'src/entities/Role';

export class RoleDto {
  readonly FIO: string;
  readonly phone: string;
  readonly email: string | null;
  readonly password: string;
  readonly roleFK: number;
}

export class RoleDBDto {
  readonly fio: string;
  readonly phone: string;
  readonly email: string | null;
  readonly password: string;
  readonly roleFK: Role;
  readonly isDelete: boolean;
}
