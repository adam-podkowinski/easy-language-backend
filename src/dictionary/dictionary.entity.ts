import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Dictionary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language: string;

  @OneToOne(() => User, (user) => user.currentDictionary, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  user: User;

  @Column()
  userId: number;
}
