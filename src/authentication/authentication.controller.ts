import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticationReturnDto } from './dto/authentication-return.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { GoogleAuthenticationService } from './google-authentication.service';

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

  @Post('google-authentication')
  authenticate(
    @Body() tokenData: TokenVerificationDto,
  ): Promise<AuthenticationReturnDto> {
    return this.googleAuthenticationService.authenticate(tokenData);
  }
}
