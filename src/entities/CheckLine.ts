import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { Check } from "./Check";

@Index("PK_CheckLine", ["id"], { unique: true })
@Entity("CheckLine", { schema: "dbo" })
export class CheckLine {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "productCount" })
  productCount: number;

  @Column("decimal", { name: "price", precision: 10, scale: 2 })
  price: number;

  @Column("bit", { name: "oldProduct" })
  oldProduct: boolean;

  @ManyToOne(() => Product, (product) => product.checkLines)
  @JoinColumn([{ name: "productFK", referencedColumnName: "id" }])
  productFk: Product;

  @ManyToOne(() => Check, (check) => check.checkLines)
  @JoinColumn([{ name: "checkFK", referencedColumnName: "id" }])
  checkFk: Check;
}
