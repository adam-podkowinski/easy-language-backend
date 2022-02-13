import { Injectable } from '@nestjs/common';
import { AuthenticationReturnDto } from './dto/authentication-return.dto';
import { UsersService } from '../user/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { Auth, google } from 'googleapis';
import { TokenVerificationDto } from './dto/token-verification.dto';

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

      const accessToken = await this.authenticationService.signUser(user);

      return { user, accessToken };
    } catch (e) {
      // Register
      if (e.status !== 404) {
        throw e;
      }

      const newUser = await this.usersService.createWithGoogle({
        ...tokenData,
        email: email,
      });

      const accessToken = await this.authenticationService.signUser(newUser);

      return { user: newUser, accessToken };
    }
  }
}
