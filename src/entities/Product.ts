import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CheckLine } from './CheckLine';
import { DeliveryLine } from './DeliveryLine';
import { Category } from './Category';
import { MeasurementUnits } from './MeasurementUnits';
import { Sale } from './Sale';
import { Manufacturer } from './Manufacturer';
import { WriteOffAct } from './WriteOffAct';

@Index('PK_Product', ['id'], { unique: true })
@Entity('Product', { schema: 'dbo' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 150 })
  title: string;

  @Column('decimal', { name: 'priceNow', precision: 10, scale: 2 })
  priceNow: number;

  @Column('int', { name: 'count' })
  count: number;

  @Column('int', { name: 'expirationDate', nullable: true })
  expirationDate: number | null;

  @Column('bit', { name: 'isArchive' })
  isArchive: boolean;

  @Column('bit', { name: 'maybeOld' })
  maybeOld: boolean;

  @OneToMany(() => CheckLine, (checkLine) => checkLine.productFK)
  checkLines: CheckLine[];

  @OneToMany(() => DeliveryLine, (deliveryLine) => deliveryLine.productFK)
  deliveryLines: DeliveryLine[];

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
  })
  @JoinColumn([{ name: 'categoryFK', referencedColumnName: 'id' }])
  categoryFK: Category;

  @ManyToOne(
    () => MeasurementUnits,
    (measurementUnits) => measurementUnits.products,
    {
      eager: true,
    },
  )
  @JoinColumn([{ name: 'measurementUnitsFK', referencedColumnName: 'id' }])
  measurementUnitsFK: MeasurementUnits;

  @ManyToOne(() => Sale, (sale) => sale.products, {
    eager: true,
  })
  @JoinColumn([{ name: 'saleFK', referencedColumnName: 'id' }])
  saleFK: Sale;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products, {
    eager: true,
  })
  @JoinColumn([{ name: 'manufacturerFK', referencedColumnName: 'id' }])
  manufacturerFK: Manufacturer;

  @OneToMany(() => WriteOffAct, (writeOffAct) => writeOffAct.productFK)
  writeOffActs: WriteOffAct[];
}
