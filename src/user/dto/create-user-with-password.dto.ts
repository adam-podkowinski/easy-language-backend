import { ThemeMode } from '../enums/theme-mode.enum';

export interface CreateUserWithPasswordDto {
  email: string;
  password: string;
  salt: string;
  themeMode?: ThemeMode;
  nativeLanguage?: string;
}
