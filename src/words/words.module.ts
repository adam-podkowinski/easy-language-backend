import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Dictionary } from '../dictionaries/dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word, Dictionary])],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
