import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { LoginDto } from '../authentication/dto/login.dto';
import { JwtAccessGuard } from '../authentication/jwt-guards';

@Controller('user')
@UseGuards(JwtAccessGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getCurrentUser(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Patch()
  updateCurrentUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.updateCurrentUser(updateUserDto, user);
  }

  @Get('logout')
  async logout(@GetUser() user: User): Promise<{ [key: string]: any }> {
    return this.usersService.logout(user);
  }

  // TODO: Handle account removal that is linked with google
  @Delete()
  deleteUser(
    @Body() loginDto: LoginDto,
    @GetUser() user: User,
  ): Promise<boolean> {
    return this.usersService.deleteUser(loginDto, user);
  }
}
