import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictionary])],
  providers: [],
  controllers: [],
})
export class DictionaryModule {}
