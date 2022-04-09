import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BonusCardOwner } from './BonusCardOwner';
import { Check } from './Check';

@Index('PK_BonusCard', ['id'], { unique: true })
@Entity('BonusCard', { schema: 'dbo' })
export class BonusCard {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('decimal', { name: 'bonusCount', precision: 10, scale: 2 })
  bonusCount: number;

  @ManyToOne(
    () => BonusCardOwner,
    (bonusCardOwner) => bonusCardOwner.bonusCards,
    {
      eager: true,
    },
  )
  @JoinColumn([{ name: 'bonusCardOwnerFK', referencedColumnName: 'id' }])
  bonusCardOwnerFk: BonusCardOwner;

  @OneToMany(() => Check, (check) => check.bonusCardFk)
  checks: Check[];
}
