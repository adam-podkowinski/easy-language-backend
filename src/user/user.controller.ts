import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  @Get()
  async getCurrentUser(@GetUser() user: User): Promise<User> {
    return user;
  }
}
