import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { SaleKinds } from "./SaleKinds";

@Index("PK_Sale", ["id"], { unique: true })
@Entity("Sale", { schema: "dbo" })
export class Sale {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("date", { name: "dateStart" })
  dateStart: Date;

  @Column("date", { name: "dateEnd" })
  dateEnd: Date;

  @Column("int", { name: "discountPercent", nullable: true })
  discountPercent: number | null;

  @Column("int", { name: "productNumberOnHand", nullable: true })
  productNumberOnHand: number | null;

  @OneToMany(() => Product, (product) => product.saleFk)
  products: Product[];

  @ManyToOne(() => SaleKinds, (saleKinds) => saleKinds.sales)
  @JoinColumn([{ name: "saleKindsFK", referencedColumnName: "id" }])
  saleKindsFk: SaleKinds;
}
