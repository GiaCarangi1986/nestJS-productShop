import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product';

@Index('PK_Category', ['id'], { unique: true })
@Entity('Category', { schema: 'dbo' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @Column('bit', { name: 'isDelete' })
  isDelete: boolean;

  @OneToMany(() => Product, (product) => product.categoryFK)
  products: Product[];
}
