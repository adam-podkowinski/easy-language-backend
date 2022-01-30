import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ThemeMode } from './enums/theme-mode.enum';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

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

  @Column({ default: 0 })
  currentDictionaryId: number = 0;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
