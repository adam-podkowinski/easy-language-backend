import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../user/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { JwtAccessTokenStrategy } from './jwt-access-token.strategy';
import { GoogleAuthenticationService } from './google-authentication.service';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    GoogleAuthenticationService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
