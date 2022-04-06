import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";

@Index("PK_MeasurementUnits", ["id"], { unique: true })
@Entity("MeasurementUnits", { schema: "dbo" })
export class MeasurementUnits {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 50 })
  title: string;

  @OneToMany(() => Product, (product) => product.measurementUnitsFk)
  products: Product[];
}
