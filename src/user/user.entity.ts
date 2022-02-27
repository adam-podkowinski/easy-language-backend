import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ThemeMode } from './enums/theme-mode.enum';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Dictionary } from '../dictionaries/dictionary.entity';
import { Word } from '../words/word.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  private password?: string;

  @Column({ nullable: true })
  @Exclude()
  public salt?: string;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean = false;

  @Column({ default: ThemeMode.System })
  themeMode: ThemeMode = ThemeMode.System;

  @Column({ default: 'en' })
  nativeLanguage: string = 'en';

  @OneToOne(() => Dictionary, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  currentDictionary?: Dictionary;

  @Column({ nullable: true })
  currentDictionaryId?: number;

  @OneToMany(() => Dictionary, (dict) => dict.user)
  dictionaries: Dictionary[];

  @OneToMany(() => Word, (word) => word.user)
  words: Word[];

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
