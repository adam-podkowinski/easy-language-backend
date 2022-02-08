import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UpdateWordDto } from './dto/update-word.dto';
import { CreateWordDto } from './dto/create-word.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';
import { Dictionary } from '../dictionaries/dictionary.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word) private readonly wordsRepository: Repository<Word>,
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
  ) {}

  async create(createWordDto: CreateWordDto, user: User): Promise<Word> {
    const { wordForeign, wordTranslation, dictionaryId, favorite } =
      createWordDto;

    const dict = await this.dictionaryRepository.findOne(dictionaryId);

    if (!dict || dict.userId !== user.id) {
      throw new UnauthorizedException(
        `Dictionary with ID: ${dictionaryId} not found.`,
      );
    }

    const createObj = {
      wordForeign,
      wordTranslation,
      dictionaryId,
      favorite,
      user,
    };

    const word: Word = await this.wordsRepository.create(createObj);

    return word.save();
  }

  async findAll(user: User): Promise<Word[]> {
    return this.wordsRepository.find({ where: { userId: user.id } });
  }

  async findOne(id: number, user: User): Promise<Word> {
    return this.wordsRepository.findOne({ where: { id, userId: user.id } });
  }

  async update(id: number, updateWordDto: UpdateWordDto, user: User) {
    return Promise.resolve(undefined);
  }

  async remove(id: number, user: User) {
    return Promise.resolve(undefined);
  }
}
