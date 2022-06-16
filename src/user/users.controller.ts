import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAccessGuard } from '../authentication/jwt-guards';
import { DeleteUserDto } from './dto/delete-user.dto';

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
    @Body() removeDto: DeleteUserDto,
    @GetUser() user: User,
  ): Promise<boolean> {
    if (user.isRegisteredWithGoogle) {
      if (!removeDto.googleToken)
        throw new UnauthorizedException('No google token provided.');
      return this.usersService.deleteUserWithGoogle(
        { token: removeDto.googleToken },
        user,
      );
    }
    if (!removeDto.email || !removeDto.password)
      throw new UnauthorizedException('No credentials provided.');

    return this.usersService.deleteUser(removeDto, user);
  }
}
