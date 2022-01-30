import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PostgresErrorCode } from '../database/error-codes.enum';
import { AuthenticationReturnDto } from './dto/authentication-return.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(
    registerDto: RegisterDto,
  ): Promise<AuthenticationReturnDto> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    try {
      const createUserData: CreateUserDto = {
        ...registerDto,
        password: hashedPassword,
        salt,
      };

      const user = await this.userService.create(createUserData);
      const token = await this.jwtService.sign({ id: user.id });

      return { token, user };
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User with that e-mail already exists.');
      }
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  public async login(
    authCredentialsDto: LoginDto,
  ): Promise<AuthenticationReturnDto> {
    const user: User = await this.userService.getByEmail(
      authCredentialsDto.email,
    );
    if (!user || !(await user.validatePassword(authCredentialsDto.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = await this.jwtService.sign({ id: user.id });

    return { token, user };
  }
}
