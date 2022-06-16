import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../user/users.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private userService: UsersService,
    public readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<User> {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const { id } = payload;
    return this.userService.getUserIfRefreshTokenMatches(refreshToken, id);
  }
}
