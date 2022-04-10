import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sale } from './Sale';

@Index('PK_SaleKinds', ['id'], { unique: true })
@Entity('SaleKinds', { schema: 'dbo' })
export class SaleKinds {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @OneToMany(() => Sale, (sale) => sale.saleKindsFK)
  sales: Sale[];
}
