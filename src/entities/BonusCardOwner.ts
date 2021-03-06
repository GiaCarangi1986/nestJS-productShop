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
import { Gender } from './Gender';

@Index('PK_BonusCardOwner', ['id'], { unique: true })
@Entity('BonusCardOwner', { schema: 'dbo' })
export class BonusCardOwner {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'FIO', length: 150 })
  fio: string;

  @Column('varchar', { name: 'phone', length: 11 })
  phone: string;

  @Column('varchar', { name: 'email', nullable: true, length: 50 })
  email: string | null;

  @Column('date', { name: 'birthDate' })
  birthDate: Date;

  @OneToMany(() => BonusCard, (bonusCard) => bonusCard.bonusCardOwnerFK)
  bonusCards: BonusCard[];

  @ManyToOne(() => Gender, (gender) => gender.bonusCardOwners, {
    eager: true,
  })
  @JoinColumn([{ name: 'genderFK', referencedColumnName: 'id' }])
  genderFK: Gender;
}
