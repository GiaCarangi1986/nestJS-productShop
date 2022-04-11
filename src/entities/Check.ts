import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { BonusCard } from './BonusCard';
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
  parentCheckId: Check;

  @OneToMany(() => Check, (check) => check.parentCheckId)
  checks: Check[];

  @ManyToOne(() => User, (user) => user.checks, {
    eager: true,
  })
  @JoinColumn([{ name: 'userFK', referencedColumnName: 'id' }])
  userFK: User;

  @ManyToOne(() => BonusCard, (bonusCard) => bonusCard.checks, {
    eager: true,
  })
  @JoinColumn([{ name: 'bonusCardFK', referencedColumnName: 'id' }])
  bonusCardFK: BonusCard;

  @OneToMany(() => CheckLine, (checkLine) => checkLine.checkFK)
  checkLines: CheckLine[];
}
