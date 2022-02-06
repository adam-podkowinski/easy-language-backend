import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWordDto {
  @IsNotEmpty()
  wordForeign: string;

  @IsNotEmpty()
  wordTranslation: string;

  @IsNotEmpty()
  dictionaryId: number;

  @IsOptional()
  favorite: boolean = false;
}
