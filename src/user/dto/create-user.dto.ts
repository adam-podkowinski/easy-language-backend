import { ThemeMode } from '../enums/theme-mode.enum';

export interface CreateUserDto {
  email: string;
  password: string;
  salt: string;
  themeMode?: ThemeMode;
  nativeLanguage?: string;
  currentDictionaryId?: number;
}
