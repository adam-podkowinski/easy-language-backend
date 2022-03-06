import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticationReturnDto } from './dto/authentication-return.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { GoogleAuthenticationService } from './google-authentication.service';
import { JwtAccessGuard, JwtRefreshGuard } from './jwt-guards';
import { User } from '../user/user.entity';
import { GetUser } from '../user/get-user.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post('register')
  async register(
    @Body() registerData: RegisterDto,
  ): Promise<AuthenticationReturnDto> {
    return this.authenticationService.register(registerData);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<AuthenticationReturnDto> {
    return this.authenticationService.login(loginData);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@GetUser() user: User): Promise<AuthenticationReturnDto> {
    const accessToken = await this.authenticationService.signUserAccess(user);

    return { user, accessToken };
  }

  @Post('google-authentication')
  authenticate(
    @Body() tokenData: TokenVerificationDto,
  ): Promise<AuthenticationReturnDto> {
    return this.googleAuthenticationService.authenticate(tokenData);
  }
}
