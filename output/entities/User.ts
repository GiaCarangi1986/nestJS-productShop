import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Check } from "./Check";
import { Role } from "./Role";
import { WriteOffAct } from "./WriteOffAct";

@Index("PK_User", ["id"], { unique: true })
@Entity("User", { schema: "dbo" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "FIO", length: 50 })
  fio: string;

  @Column("varchar", { name: "password", length: 50 })
  password: string;

  @Column("varchar", { name: "phone", length: 50 })
  phone: string;

  @Column("varchar", { name: "email", nullable: true, length: 50 })
  email: string | null;

  @Column("bit", { name: "isDelete" })
  isDelete: boolean;

  @OneToMany(() => Check, (check) => check.userFk)
  checks: Check[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn([{ name: "roleFK", referencedColumnName: "id" }])
  roleFk: Role;

  @OneToMany(() => WriteOffAct, (writeOffAct) => writeOffAct.userFk)
  writeOffActs: WriteOffAct[];
}
