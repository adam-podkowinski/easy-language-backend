import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ThemeMode } from './enums/theme-mode.enum';
import { essentialcontacts_v1 } from 'googleapis';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ default: ThemeMode.System })
  public themeMode: ThemeMode = ThemeMode.System;

  @Column({ default: 'en' })
  public nativeLanguage: string = 'en';

  @Column({ default: 0 })
  public currentDictionaryId: number = 0;

  @UpdateDateColumn()
  public updatedAt: Date;
}
