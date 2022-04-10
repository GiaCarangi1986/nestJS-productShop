import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryLine } from './DeliveryLine';

@Index('PK_Delivery', ['id'], { unique: true })
@Entity('Delivery', { schema: 'dbo' })
export class Delivery {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('date', { name: 'date' })
  date: Date;

  @OneToMany(() => DeliveryLine, (deliveryLine) => deliveryLine.deliveryFK)
  deliveryLines: DeliveryLine[];
}
