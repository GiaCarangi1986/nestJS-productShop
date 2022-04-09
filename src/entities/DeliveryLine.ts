import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { Delivery } from "./Delivery";

@Index("PK_DeliveryLine", ["id"], { unique: true })
@Entity("DeliveryLine", { schema: "dbo" })
export class DeliveryLine {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "productCount" })
  productCount: number;

  @Column("decimal", { name: "priceBuy", precision: 10, scale: 2 })
  priceBuy: number;

  @ManyToOne(() => Product, (product) => product.deliveryLines)
  @JoinColumn([{ name: "productFK", referencedColumnName: "id" }])
  productFk: Product;

  @ManyToOne(() => Delivery, (delivery) => delivery.deliveryLines)
  @JoinColumn([{ name: "deliveryFK", referencedColumnName: "id" }])
  deliveryFk: Delivery;
}
