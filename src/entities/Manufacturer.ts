import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product';

@Index('PK_Manufacturer', ['id'], { unique: true })
@Entity('Manufacturer', { schema: 'dbo' })
export class Manufacturer {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @OneToMany(() => Product, (product) => product.manufacturerFK)
  products: Product[];
}
