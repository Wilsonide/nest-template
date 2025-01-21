import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { newPasswordDto } from 'src/users/dto/new-password.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
/* import crypto from 'crypto'; */

@Injectable()
export class VerificationService {
  constructor(private databaseService: DatabaseService) {}

  async getTokenByToken(token: string) {
    try {
      const verifyToken =
        await this.databaseService.verificationToken.findUnique({
          where: { token },
        });
      return verifyToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findUserbyEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async createVerificationToken(mail: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await this.getTokenByEmail(mail);
    if (existingToken) {
      await this.databaseService.verificationToken.delete({
        where: { id: existingToken.id },
      });
    }
    await this.databaseService.verificationToken.create({
      data: {
        token,
        expires,
        email: mail as string,
      },
    });
    return token;
  }

  async newPassword(dto: newPasswordDto) {
    const { password, confirmPassword, token } = dto;
    if (!token) {
      return { error: 'Missing Token' };
    }
    if (!password || !confirmPassword) return { error: 'Invalid fields' };
    if (confirmPassword !== password) {
      return 'password does not match';
    }

    const existingToken = await this.getPasswordTokenByToken(token);

    if (!existingToken) {
      return { error: 'Invalid token' };
    }
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: 'token has expired' };
    }

    const existingUser = await this.findUserbyEmail(existingToken.email);

    if (!existingUser) {
      return { error: 'Email does not exist' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.databaseService.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    await this.databaseService.passordResetToken.delete({
      where: { id: existingToken.id },
    });

    return { success: 'Password updated successfully' };
  }

  async verifyEmail(token: string) {
    const existingToken = await this.getTokenByToken(token);
    if (!existingToken) {
      return { error: 'token not found' };
    }
    /* const hasExpired = new Date(existingToken.expires) < new Date(); */

    /* if (hasExpired) {
      return { error: 'token expired' };
    } */
    const existingUser = await this.findUserbyEmail(existingToken.email);
    if (!existingUser) return { error: 'token not found' };

    await this.databaseService.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: true,
        email: existingToken.email,
      },
    });
    /* await this.databaseService.verificationToken.delete({
      where: { id: existingToken.id },
    }); */
    return { success: 'email verified' };
  }

  async getTokenByEmail(email: string) {
    try {
      const verifyToken =
        await this.databaseService.verificationToken.findFirst({
          where: { email },
        });
      return verifyToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPasswordTokenByToken(token: string) {
    try {
      const verifyToken =
        await this.databaseService.passordResetToken.findUnique({
          where: { token },
        });
      return verifyToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPasswordTokenByEmail(email: string) {
    try {
      const verifyToken =
        await this.databaseService.passordResetToken.findFirst({
          where: { email },
        });
      return verifyToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createPasswordToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await this.getPasswordTokenByEmail(email);
    if (existingToken) {
      await this.databaseService.passordResetToken.delete({
        where: { id: existingToken.id },
      });
    }
    await this.databaseService.passordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return token;
  }
}
