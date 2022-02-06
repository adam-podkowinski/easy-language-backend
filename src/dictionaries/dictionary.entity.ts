import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Exclude } from 'class-transformer';
import { Word } from '../words/word.entity';

@Entity()
@Unique(['userId', 'language'])
export class Dictionary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language: string;

  @OneToMany(() => Word, (word) => word.dictionary)
  words: Word[];

  @OneToOne(() => Word, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  flashcard?: Word;

  @Column({ nullable: true })
  flashcardId?: number;

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
