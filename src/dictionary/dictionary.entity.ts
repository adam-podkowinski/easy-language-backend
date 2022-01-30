import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['userId', 'language'])
export class Dictionary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language: string;

  @ManyToOne(() => User, (user) => user.dictionaries, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  user: User;

  @Column()
  @Exclude()
  userId: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
