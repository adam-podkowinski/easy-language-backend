import { PartialType } from '@nestjs/mapped-types';
import { CreateDictionaryDto } from './create-dictionary.dto';
import { IsOptional } from 'class-validator';

export class UpdateDictionaryDto extends PartialType(CreateDictionaryDto) {
  @IsOptional()
  language?: string;
}
