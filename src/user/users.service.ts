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
import * as bcrypt from 'bcrypt';
import { TokenVerificationDto } from 'src/authentication/dto/token-verification.dto';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Dictionary)
    private dictionariesRepository: Repository<Dictionary>,
    private readonly configService: ConfigService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException(`User with email ${email} does not exist`);
    return user;
  }

  async getById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['currentDictionary'],
    });
    if (!user)
      throw new NotFoundException(`User with ID: ${id} does not exist`);
    return user;
  }

  async createWithPassword(userData: CreateUserWithPasswordDto): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user = await this.getById(userId);

    if (!user.currentHashedRefreshToken)
      throw new UnauthorizedException(
        'No refresh token exists, please log in.',
      );

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }

    throw new UnauthorizedException('Refresh tokens do not match.');
  }

  async createWithGoogle(userData: CreateUserWithGoogleDto): Promise<User> {
    const createData = { ...userData, isRegisteredWithGoogle: true };
    const newUser = this.usersRepository.create(createData);
    await newUser.save();
    return newUser;
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user)
      throw new NotFoundException(`User with id: ${userId} not found.`);

    user.currentHashedRefreshToken = await bcrypt.hash(refreshToken, user.salt);
    return await user.save();
  }

  async updateCurrentUser(
    updateUserDto: UpdateUserDto,
    user: User,
  ): Promise<User> {
    if (updateUserDto.currentDictionaryId != null) {
      const dict: Dictionary = await this.dictionariesRepository.findOne({
        where: { id: updateUserDto.currentDictionaryId, userId: user.id },
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

  async deleteUserWithGoogle(
    tokenData: TokenVerificationDto,
    user: User,
  ): Promise<boolean> {
    if (!user.isRegisteredWithGoogle)
      throw new UnauthorizedException(
        'Could not remove an account that is not linked with google.',
      );

    const { token } = tokenData;
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;
    const googleUser = await this.getByEmail(email);

    if (googleUser.id !== user.id)
      throw new UnauthorizedException('Unauthorized');

    const removed = await user.remove();

    return !removed.hasId();
  }

  async deleteUser(loginDto: LoginDto, user: User): Promise<boolean> {
    if (user.email !== loginDto.email)
      throw new UnauthorizedException('Invalid credentials');
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

  async logout(user: User): Promise<{ [key: string]: any }> {
    await this.usersRepository.update(user.id, {
      currentHashedRefreshToken: null,
    });

    return { accessToken: '', user: null, message: 'Logged out successfully.' };
  }
}
