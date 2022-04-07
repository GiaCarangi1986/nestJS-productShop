import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BonusCardOwner } from "./BonusCardOwner";

@Index("PK_Gender", ["id"], { unique: true })
@Entity("Gender", { schema: "dbo" })
export class Gender {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 50 })
  title: string;

  @OneToMany(() => BonusCardOwner, (bonusCardOwner) => bonusCardOwner.genderFk)
  bonusCardOwners: BonusCardOwner[];
}
