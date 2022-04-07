import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Index("PK_WriteOffAct", ["id"], { unique: true })
@Entity("WriteOffAct", { schema: "dbo" })
export class WriteOffAct {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "productCount" })
  productCount: number;

  @Column("datetime", { name: "dateTimeWriteOff" })
  dateTimeWriteOff: Date;

  @ManyToOne(() => User, (user) => user.writeOffActs)
  @JoinColumn([{ name: "userFK", referencedColumnName: "id" }])
  userFk: User;

  @ManyToOne(() => Product, (product) => product.writeOffActs)
  @JoinColumn([{ name: "productFK", referencedColumnName: "id" }])
  productFk: Product;
}
