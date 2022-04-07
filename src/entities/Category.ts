import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";

@Index("PK_Category", ["id"], { unique: true })
@Entity("Category", { schema: "dbo" })
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 100 })
  title: string;

  @OneToMany(() => Product, (product) => product.categoryFk)
  products: Product[];
}
