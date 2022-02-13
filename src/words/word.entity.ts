import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LearningStatus } from './enums/learning-status.enum';
import { Dictionary } from '../dictionaries/dictionary.entity';
import { User } from '../user/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wordForeign: string;

  @Column()
  wordTranslation: string;

  @Column({ default: LearningStatus.reviewing })
  learningStatus: LearningStatus = LearningStatus.reviewing;

  @Column({ default: 0, unsigned: true })
  timesReviewed: number = 0;

  @Column({ default: false })
  favorite: boolean = false;

  @ManyToOne(() => Dictionary, (dict) => dict.words, {
    onDelete: 'CASCADE',
  })
  dictionary: Dictionary;

  @Column()
  dictionaryId: number;

  @ManyToOne(() => User, (user) => user.words, {
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
