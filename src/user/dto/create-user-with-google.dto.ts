import { ThemeMode } from '../enums/theme-mode.enum';

export interface CreateUserWithGoogleDto {
  email: string;
  themeMode?: ThemeMode;
  nativeLanguage?: string;
  salt: string;
}
