import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { registerUserDto } from './dto/register-user.dto';
import { VerificationService } from 'src/verification/verification.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { AccountGuard } from 'src/auth/decorator/account-guard.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private verifyService: VerificationService,
  ) {}

  @Post()
  create(@Body() dto: registerUserDto) {
    return this.usersService.create(dto);
  }
  @AccountGuard()
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }
  @Public()
  @Get('new-verification?')
  async verifyEmail(@Query('token') token: string) {
    console.log(token);
    const result = await this.verifyService.verifyEmail(token);
    return result;
  }
}
