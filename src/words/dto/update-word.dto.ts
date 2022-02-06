import { IsEnum, IsOptional } from 'class-validator';
import { LearningStatus } from '../enums/learning-status.enum';

export class UpdateWordDto {
  @IsOptional()
  wordForeign?: string;

  @IsOptional()
  wordTranslation?: string;

  @IsOptional()
  @IsEnum(LearningStatus)
  learningStatus?: LearningStatus;

  @IsOptional()
  timesReviewed?: number;

  @IsOptional()
  favorite?: boolean;
}
