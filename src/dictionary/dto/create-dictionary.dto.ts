import { IsNotEmpty } from 'class-validator';

export class CreateDictionaryDto {
  @IsNotEmpty()
  language: string;
}
