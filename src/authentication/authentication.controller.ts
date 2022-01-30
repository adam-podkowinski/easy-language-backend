import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  public async register(
    @Body() registerData: RegisterDto,
  ): Promise<{ token: string; user: User }> {
    return this.authenticationService.register(registerData);
  }

  @Post('login')
  public async login(@Body() loginData: LoginDto) {
    return this.authenticationService.login(loginData);
  }
}
