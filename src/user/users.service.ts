import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserWithPasswordDto } from './dto/create-user-with-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Dictionary } from '../dictionaries/dictionary.entity';
import { CreateUserWithGoogleDto } from './dto/create-user-with-google.dto';
import { LoginDto } from '../authentication/dto/login.dto';

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
      throw new NotFoundException(`User with email ${email} does not exist`);
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

  async createWithPassword(userData: CreateUserWithPasswordDto): Promise<User> {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async createWithGoogle(userData: CreateUserWithGoogleDto): Promise<User> {
    const createData = { ...userData, isRegisteredWithGoogle: true };
    const newUser = await this.usersRepository.create(createData);
    await newUser.save();
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

  async deleteUser(loginDto: LoginDto, user: User): Promise<boolean> {
    const userWithSalt = await this.usersRepository
      .createQueryBuilder()
      .where('id = :id', { id: user.id })
      .getOne();

    if (userWithSalt.isRegisteredWithGoogle)
      throw new UnauthorizedException(
        'Could not remove an account that is linked with google.',
      );

    const credentialsCorrect = await userWithSalt.validatePassword(
      loginDto.password,
    );

    if (!credentialsCorrect)
      throw new UnauthorizedException(
        'Could not remove an account - credentials incorrect.',
      );

    const removed = await user.remove();

    return !removed.hasId();
  }
}
