import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BonusCard } from './BonusCard';
import { User } from './User';
import { CheckLine } from './CheckLine';

@Index('PK_Check', ['id'], { unique: true })
@Entity('Check', { schema: 'dbo' })
export class Check {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', { name: 'dateTime' })
  dateTime: Date;

  @Column('decimal', { name: 'totalSum', precision: 10, scale: 4 })
  totalSum: number;

  @Column('int', { name: 'bonusCount', nullable: true })
  bonusCount: number | null;

  @Column('bit', { name: 'paid' })
  paid: boolean;

  @Column('bit', { name: 'changedCheck' })
  changedCheck: boolean;

  @ManyToOne(() => Check, (check) => check.checks)
  @JoinColumn([{ name: 'parentCheckId', referencedColumnName: 'id' }])
  parentCheck: Check;

  @OneToMany(() => Check, (check) => check.parentCheck)
  checks: Check[];

  @ManyToOne(() => BonusCard, (bonusCard) => bonusCard.checks)
  @JoinColumn([{ name: 'bonusCardFK', referencedColumnName: 'id' }])
  bonusCardFk: BonusCard;

  @ManyToOne(() => User, (user) => user.checks)
  @JoinColumn([{ name: 'userFK', referencedColumnName: 'id' }])
  userFk: User;

  @OneToMany(() => CheckLine, (checkLine) => checkLine.checkFk)
  checkLines: CheckLine[];
}
