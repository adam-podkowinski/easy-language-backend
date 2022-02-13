import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { GoogleAuthenticationService } from './google-authentication.service';
import { AuthenticationReturnDto } from './dto/authentication-return.dto';

@Controller('google-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(
    @Body() tokenData: TokenVerificationDto,
  ): Promise<AuthenticationReturnDto> {
    return this.googleAuthenticationService.authenticate(tokenData);
  }
}
