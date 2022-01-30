import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Dictionary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  language: string;

  @OneToOne(() => User, (user) => user.currentDictionary, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  @IsNotEmpty()
  userId: number;
}
