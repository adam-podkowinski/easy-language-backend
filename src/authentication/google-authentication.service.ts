import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationReturnDto } from './dto/authentication-return.dto';
import { UsersService } from '../user/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { Auth, google } from 'googleapis';
import { TokenVerificationDto } from './dto/token-verification.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(
    tokenData: TokenVerificationDto,
  ): Promise<AuthenticationReturnDto> {
    const { token } = tokenData;
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;

    try {
      // Login
      const user = await this.usersService.getByEmail(email);

      if (!user.isRegisteredWithGoogle)
        return Promise.reject(
          new UnauthorizedException('Account registered with password.'),
        );

      const accessToken = await this.authenticationService.signUserAccess(user);
      const refreshToken = await this.authenticationService.signUserRefresh(
        user,
      );

      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

      return { user, refreshToken, accessToken };
    } catch (e) {
      // Register
      if (e.status !== 404) {
        throw e;
      }

      const newUser = await this.usersService.createWithGoogle({
        ...tokenData,
        email: email,
        salt: await bcrypt.genSalt(),
      });

      const accessToken = await this.authenticationService.signUserAccess(
        newUser,
      );
      const refreshToken = await this.authenticationService.signUserRefresh(
        newUser,
      );

      await this.usersService.setCurrentRefreshToken(refreshToken, newUser.id);

      return { user: newUser, refreshToken, accessToken };
    }
  }
}
