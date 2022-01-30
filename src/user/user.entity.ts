import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ThemeMode } from './enums/theme-mode.enum';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Dictionary } from '../dictionary/dictionary.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  private password: string;

  @Column()
  @Exclude()
  private salt: string;

  @Column({ default: ThemeMode.System })
  themeMode: ThemeMode = ThemeMode.System;

  @Column({ default: 'en' })
  nativeLanguage: string = 'en';

  @OneToOne(() => Dictionary, (dict) => dict.user, {
    nullable: true,
  })
  currentDictionary?: Dictionary;

  @Column({ nullable: true })
  currentDictionaryId?: number;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
