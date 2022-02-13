import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { Dictionary } from './dictionary.entity';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { catchUniqueViolation } from '../database/helpers';
import { Word } from '../words/word.entity';

@Injectable()
export class DictionariesService {
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionariesRepository: Repository<Dictionary>,
    @InjectRepository(Word)
    private readonly wordsRepository: Repository<Word>,
  ) {}

  async create(
    createDictionaryDto: CreateDictionaryDto,
    user: User,
  ): Promise<Dictionary> {
    const { language } = createDictionaryDto;
    const dict = new Dictionary();
    dict.language = language;
    dict.user = user;
    user.currentDictionary = dict;

    await dict.save().catch(catchUniqueViolation);

    await user.save();
    return dict;
  }

  findAll(user: User): Promise<Dictionary[]> {
    return this.dictionariesRepository.find({ where: { userId: user.id } });
  }

  async findOne(id: number, user: User): Promise<Dictionary> {
    const dict = await this.dictionariesRepository.findOne({
      where: { userId: user.id, id },
    });

    if (!dict) {
      throw new NotFoundException(`Dictionary with ID: ${id} not found`);
    }

    return dict;
  }

  async update(
    id: number,
    updateDictionaryDto: UpdateDictionaryDto,
    user: User,
  ): Promise<Dictionary> {
    if (updateDictionaryDto.flashcardId != null) {
      const flashcard: Word = await this.wordsRepository.findOne({
        where: { id: updateDictionaryDto.flashcardId, userId: user.id },
      });

      if (!flashcard) {
        throw new NotFoundException(
          `Not found a flashcard with an id of ${updateDictionaryDto.flashcardId}`,
        );
      }
    }

    await this.dictionariesRepository
      .update(
        {
          id,
          user,
        },
        updateDictionaryDto,
      )
      .catch(catchUniqueViolation);
    return await this.findOne(id, user);
  }

  async remove(id: number, user: User): Promise<Dictionary> {
    const dict = await this.findOne(id, user);
    const wasCurrentDictionary = dict.id === user.currentDictionaryId;
    await dict.remove();

    if (wasCurrentDictionary) {
      const newDict = await this.dictionariesRepository.findOne({
        where: { userId: user.id },
      });
      if (newDict) {
        user.currentDictionary = newDict;
        await user.save();
      }
      return newDict;
    }

    return await this.dictionariesRepository.findOne({
      id: user.currentDictionaryId,
      user,
    });
  }

  async findOneWithWords(id: number, user: User): Promise<Dictionary> {
    const dict = await this.dictionariesRepository.findOne({
      where: { userId: user.id, id },
      relations: ['words'],
    });

    if (!dict) {
      throw new NotFoundException(`Dictionary with ID: ${id} not found`);
    }

    return dict;
  }
}
