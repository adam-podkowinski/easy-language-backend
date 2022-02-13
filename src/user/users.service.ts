import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Dictionary } from '../dictionaries/dictionary.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Dictionary)
    private dictionariesRepository: Repository<Dictionary>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (!user)
      throw new NotFoundException(`User with ${email} email does not exist`);
    return user;
  }

  async getById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id, {
      relations: ['currentDictionary'],
    });
    if (!user)
      throw new NotFoundException(`User with ID: ${id} does not exist`);
    return user;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateCurrentUser(
    updateUserDto: UpdateUserDto,
    user: User,
  ): Promise<User> {
    if (updateUserDto.currentDictionaryId != null) {
      const dict: Dictionary = await this.dictionariesRepository.findOne({
        where: { id: updateUserDto.currentDictionaryId, user: user },
      });

      if (!dict) {
        throw new NotFoundException(
          `Dictionary with id of ${updateUserDto.currentDictionaryId} not found.`,
        );
      }
    }

    await this.usersRepository.update({ id: user.id }, updateUserDto);

    return this.getById(user.id);
  }
}