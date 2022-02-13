import { IsOptional } from 'class-validator';

export class UpdateDictionaryDto {
  @IsOptional()
  language?: string;

  @IsOptional()
  flashcardId?: number;
}
