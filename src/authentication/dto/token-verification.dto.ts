import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ThemeMode } from '../../user/enums/theme-mode.enum';

export class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsEnum(ThemeMode)
  themeMode?: ThemeMode;

  @IsOptional()
  nativeLanguage?: string;
}
