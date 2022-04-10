import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index('PK_Role', ['id'], { unique: true })
@Entity('Role', { schema: 'dbo' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 50 })
  title: string;

  @OneToMany(() => User, (user) => user.roleFK)
  users: User[];
}
