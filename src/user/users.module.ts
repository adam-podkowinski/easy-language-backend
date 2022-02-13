import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { Dictionary } from '../dictionaries/dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Dictionary])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
