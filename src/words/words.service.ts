import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UpdateWordDto } from './dto/update-word.dto';
import { CreateWordDto } from './dto/create-word.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word) private readonly wordsRepository: Repository<Word>,
  ) {}

  async create(createWordDto: CreateWordDto, user: User) {
    return Promise.resolve(undefined);
  }

  async findAll(user: User) {
    return Promise.resolve([]);
  }

  async findOne(id: number, user: User) {
    return Promise.resolve(undefined);
  }

  async update(id: number, updateWordDto: UpdateWordDto, user: User) {
    return Promise.resolve(undefined);
  }

  async remove(id: number, user: User) {
    return Promise.resolve(undefined);
  }
}
