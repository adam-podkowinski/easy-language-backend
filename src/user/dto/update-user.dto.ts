import { IsEnum, IsOptional } from 'class-validator';
import { ThemeMode } from '../enums/theme-mode.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(ThemeMode)
  themeMode?: ThemeMode;

  @IsOptional()
  nativeLanguage: string;

  @IsOptional()
  currentDictionaryId: number;
}
