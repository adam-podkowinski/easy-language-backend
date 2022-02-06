import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { Dictionary } from './dictionary.entity';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { catchUniqueViolation } from '../database/helpers';

@Injectable()
export class DictionariesService {
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
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
    return this.dictionaryRepository.find({ where: { userId: user.id } });
  }

  async findOne(id: number, user: User): Promise<Dictionary> {
    const dict = await this.dictionaryRepository.findOne({
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
    const updateObj: UpdateDictionaryDto = {
      language: updateDictionaryDto.language,
    };
    await this.dictionaryRepository
      .update(
        {
          id,
          user,
        },
        updateObj,
      )
      .catch(catchUniqueViolation);
    return await this.findOne(id, user);
  }

  async remove(id: number, user: User): Promise<Dictionary> {
    const dict = await this.findOne(id, user);
    const isCurrentDictionary = dict.id === user.currentDictionaryId;
    await dict.remove();

    if (isCurrentDictionary) {
      const newDict = await this.dictionaryRepository.findOne({
        where: { userId: user.id },
      });
      if (newDict) {
        user.currentDictionary = newDict;
        await user.save();
      }
    }

    return user.currentDictionary;
  }
}
