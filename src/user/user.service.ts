import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user)
      throw new NotFoundException(`User with ${email} email does not exist`);
    return user;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user)
      throw new NotFoundException(`User with ID: ${id} does not exist`);
    return user;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
