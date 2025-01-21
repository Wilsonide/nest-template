import { Body, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from 'src/database/database.service';
import { registerUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/message/email.service';
import { VerificationService } from 'src/verification/verification.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private emailService: EmailService,
    private verifyService: VerificationService,
  ) {}

  async updateUserRefresh_Token(email: string, refresh_token: string) {
    await this.databaseService.user.update({
      where: { email },
      data: { refreshToken: refresh_token },
    });
  }
  async create(@Body() dto: registerUserDto) {
    const { email, password, name } = dto;
    const user = await this.findbyEmail(email);
    if (user) {
      // TODO: return exception if user already exists.
      return { error: 'user already exists' };
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.databaseService.user.create({
      data: {
        email,
        password: hashPassword,
        name,
      },
    });
    delete newUser.password;
    const token = await this.verifyService.createVerificationToken(
      newUser.email,
    );
    await this.emailService.sendVerificationEmail(newUser.email, token);
    return { success: 'confirmation email sent' };
  }

  async findbyEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async getAll() {
    const user = await this.databaseService.user.findMany();
    return user;
  }

  async findbyToken(token: string) {
    const user = await this.databaseService.user.findFirst({
      where: { refreshToken: token },
    });
    return user;
  }

  async findMany() {
    return await this.databaseService.user.findMany();
  }
}
