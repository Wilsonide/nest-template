import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/message/email.service';
import { VerificationService } from 'src/verification/verification.service';
import { newPasswordDto } from 'src/users/dto/new-password.dto';
import { resetPasswordDto } from 'src/users/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
    private configService: ConfigService,
    private emailService: EmailService,
    private verifyService: VerificationService,
  ) {}

  @Get('logout')
  logout(@Request() req: ExpressRequest) {
    this.authService.logout(req.user['email']);
  }

  @Public()
  @Post('register')
  signup(@Body() dto: registerUserDto) {
    return this.userService.create(dto);
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signin(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.authService.login(req.user, res);
  }
  @Public()
  @Get('refresh')
  refresh(@Request() req: ExpressRequest) {
    return this.authService.refresh(req);
  }

  @Public()
  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githublogin() {}

  @Public()
  @Get('callback/github')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    console.log(req.user);
    await this.authService.oauthCreateUser(req.user);
    return this.authService.login(req.user, res);
  }
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googlelogin() {}

  @Public()
  @Get('callback/google')
  @UseGuards(GoogleAuthGuard)
  async googlebAuthCallback(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    console.log(req.user);
    await this.authService.oauthCreateUser(req.user);
    return this.authService.login(req.user, res);
  }

  @Public()
  @Post('new-password')
  async newPassword(@Body() dto: newPasswordDto) {
    const result = await this.verifyService.newPassword(dto);
    return result;
  }
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: resetPasswordDto) {
    const token = await this.verifyService.createPasswordToken(dto.email);
    return await this.emailService.sendnewpasswordmail(dto.email, token);
  }
}
