import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserWithPasswordDto } from '../user/dto/create-user-with-password.dto';
import { PostgresErrorCode } from '../database/error-codes.enum';
import { AuthenticationReturnDto } from './dto/authentication-return.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async signUser(user: User): Promise<string> {
    return this.jwtService.sign({ id: user.id });
  }

  public async register(
    registerDto: RegisterDto,
  ): Promise<AuthenticationReturnDto> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    try {
      const createUserData: CreateUserWithPasswordDto = {
        ...registerDto,
        password: hashedPassword,
        salt,
      };

      const user = await this.userService.createWithPassword(createUserData);
      const accessToken = await this.signUser(user);

      return { accessToken, user };
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User with that e-mail already exists.');
      }
      throw e;
    }
  }

  public async login(
    authCredentialsDto: LoginDto,
  ): Promise<AuthenticationReturnDto> {
    const user: User = await this.userService.getByEmail(
      authCredentialsDto.email,
    );

    if (!user || user.isRegisteredWithGoogle) {
      throw new UnauthorizedException(
        'Account linked with Google account. Log in using Google OAuth',
      );
    }

    if (!(await user.validatePassword(authCredentialsDto.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = await this.signUser(user);

    return { accessToken, user };
  }
}
