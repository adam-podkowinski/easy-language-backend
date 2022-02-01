import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { Dictionary } from './dictionary.entity';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from '../database/error-codes.enum';

@Injectable()
export class DictionaryService {
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

    await dict.save().catch((e) => {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(
          'Dictionary with that language already exists.',
        );
      }
      throw e;
    });

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
    const dict = await this.findOne(id, user);
    dict.language = updateDictionaryDto.language;
    await dict.save().catch((e) => {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(
          'Dictionary with that language already exists.',
        );
      }
      throw e;
    });
    return dict;
  }

  remove(id: number) {
    return `This action removes a #${id} dictionary`;
  }
}
