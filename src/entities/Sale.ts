import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product';

@Index('PK_Sale', ['id'], { unique: true })
@Entity('Sale', { schema: 'dbo' })
export class Sale {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('date', { name: 'dateStart' })
  dateStart: Date;

  @Column('date', { name: 'dateEnd' })
  dateEnd: Date;

  @Column('int', { name: 'discountPercent', nullable: true })
  discountPercent: number | null;

  @OneToMany(() => Product, (product) => product.saleFK)
  products: Product[];
}
