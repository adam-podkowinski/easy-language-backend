import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../user/users.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(
    private userService: UsersService,
    public configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userService.getById(id);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
