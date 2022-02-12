import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

    dict.tempUpdatedAt = new Date();
    await dict.save();

    return word.save();
  }

  async findAll(user: User): Promise<Word[]> {
    return this.wordsRepository.find({ where: { userId: user.id } });
  }

  async findOne(id: number, user: User): Promise<Word> {
    const word: Word = await this.wordsRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!word) throw new NotFoundException(`Word with id: ${id} not found.`);

    return word;
  }

  async update(
    id: number,
    updateWordDto: UpdateWordDto,
    user: User,
  ): Promise<Word> {
    await this.wordsRepository.update({ id, user }, updateWordDto);
    user.currentDictionary.tempUpdatedAt = new Date();
    await user.currentDictionary.save();
    return await this.findOne(id, user);
  }

  async remove(id: number, user: User): Promise<Word> {
    const word = await this.findOne(id, user);
    user.currentDictionary.tempUpdatedAt = new Date();
    await user.currentDictionary.save();
    return await word.remove();
  }
}
