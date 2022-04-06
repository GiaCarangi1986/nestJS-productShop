import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CheckLine } from "./CheckLine";
import { DeliveryLine } from "./DeliveryLine";
import { Category } from "./Category";
import { MeasurementUnits } from "./MeasurementUnits";
import { Sale } from "./Sale";
import { Manufacturer } from "./Manufacturer";
import { WriteOffAct } from "./WriteOffAct";

@Index("PK_Product", ["id"], { unique: true })
@Entity("Product", { schema: "dbo" })
export class Product {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 150 })
  title: string;

  @Column("decimal", { name: "priceNow", precision: 10, scale: 2 })
  priceNow: number;

  @Column("bit", { name: "isArchive" })
  isArchive: boolean;

  @Column("bit", { name: "maybeOld" })
  maybeOld: boolean;

  @OneToMany(() => CheckLine, (checkLine) => checkLine.productFk)
  checkLines: CheckLine[];

  @OneToMany(() => DeliveryLine, (deliveryLine) => deliveryLine.productFk)
  deliveryLines: DeliveryLine[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn([{ name: "categoryFK", referencedColumnName: "id" }])
  categoryFk: Category;

  @ManyToOne(
    () => MeasurementUnits,
    (measurementUnits) => measurementUnits.products
  )
  @JoinColumn([{ name: "measurementUnitsFK", referencedColumnName: "id" }])
  measurementUnitsFk: MeasurementUnits;

  @ManyToOne(() => Sale, (sale) => sale.products)
  @JoinColumn([{ name: "saleFK", referencedColumnName: "id" }])
  saleFk: Sale;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products)
  @JoinColumn([{ name: "manufacturerFK", referencedColumnName: "id" }])
  manufacturerFk: Manufacturer;

  @OneToMany(() => WriteOffAct, (writeOffAct) => writeOffAct.productFk)
  writeOffActs: WriteOffAct[];
}
