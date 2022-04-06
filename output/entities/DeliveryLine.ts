import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Delivery } from "./Delivery";
import { Product } from "./Product";

@Index("PK_DeliveryLine", ["id"], { unique: true })
@Entity("DeliveryLine", { schema: "dbo" })
export class DeliveryLine {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "productCount" })
  productCount: number;

  @Column("decimal", { name: "priceBuy", precision: 10, scale: 2 })
  priceBuy: number;

  @ManyToOne(() => Delivery, (delivery) => delivery.deliveryLines)
  @JoinColumn([{ name: "deliveryFK", referencedColumnName: "id" }])
  deliveryFk: Delivery;

  @ManyToOne(() => Product, (product) => product.deliveryLines)
  @JoinColumn([{ name: "productFK", referencedColumnName: "id" }])
  productFk: Product;
}
