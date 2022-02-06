import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';
import { DictionariesController } from './dictionaries.controller';
import { DictionariesService } from './dictionaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary])],
  providers: [DictionariesService],
  controllers: [DictionariesController],
})
export class DictionariesModule {}
