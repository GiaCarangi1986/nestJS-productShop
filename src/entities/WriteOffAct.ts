import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Index('PK_WriteOffAct', ['id'], { unique: true })
@Entity('WriteOffAct', { schema: 'dbo' })
export class WriteOffAct {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('decimal', { name: 'productCount', precision: 10, scale: 2 })
  productCount: number;

  @Column('datetime', { name: 'dateTimeWriteOff' })
  dateTimeWriteOff: Date;

  @ManyToOne(() => User, (user) => user.writeOffActs, {
    eager: true,
  })
  @JoinColumn([{ name: 'userFK', referencedColumnName: 'id' }])
  userFK: User;

  @ManyToOne(() => Product, (product) => product.writeOffActs, {
    eager: true,
  })
  @JoinColumn([{ name: 'productFK', referencedColumnName: 'id' }])
  productFK: Product;
}
