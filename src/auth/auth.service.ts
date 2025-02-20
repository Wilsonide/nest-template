import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Req,
  Response,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { Request, Response as ExpressResponse } from 'express';
import { DatabaseService } from 'src/database/database.service';

type Payload = {
  email: string;
  sub: number | string;
  emailVerified: boolean | null;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {}

  async logout(email: string) {
    return this.userService.updateUserRefresh_Token(email, '');
  }
  async createAccessToken(data: Payload, expires: string) {
    const payload = {
      email: data.email,
      sub: data.sub,
      emailVerified: data.emailVerified,
    };
    const accessToken = await this.jwtService
      .signAsync(payload, { expiresIn: expires })
      .catch((error) => {
        console.log(error);
      });
    return accessToken;
  }

  async createRefreshToken(data: Payload, expires: string) {
    const payload = {
      email: data.email,
      sub: data.sub,
      emailVerified: data.emailVerified,
    };
    const refreshToken = await this.jwtService
      .signAsync(payload, { expiresIn: expires })
      .catch((error) => {
        console.log(error);
      });
    return refreshToken;
  }

  async oauthCreateUser(params) {
    const { email, name, provider, picture } = params;
    const user = await this.userService.findbyEmail(email);
    if (user && user.provider === provider) {
      // TODO: return exception if user already exists.
      return await this.databaseService.user.update({
        where: {
          email,
        },
        data: {
          email,
          emailVerified: true,
          image: picture,
          name,
          provider: provider,
        },
      });
    }
    if (user && user.provider !== provider) {
      throw new ConflictException('email already in use with another provider');
    }
    await this.databaseService.user.create({
      data: {
        email,
        provider,
        emailVerified: true,
        image: picture,
        name,
      },
    });
  }
  async validateUser(email: string, pass: string) {
    const user = await this.userService.findbyEmail(email);
    if (!user) {
      return null;
    }
    try {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async login(
    user: any,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const payload = {
      email: user.email,
      sub: user.id,
      emailVerified: user.emailVerified,
    };
    const refreshToken = await this.createRefreshToken(
      payload,
      this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
    );

    const accessToken = await this.createAccessToken(
      payload,
      this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
    );
    /* await this.databaseService.user.update({
      where: { email: user.email },
      data: { refreshToken: refreshToken as string },
    }); */
    await this.userService.updateUserRefresh_Token(
      user.email,
      refreshToken as string,
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 24 * 1000, //24 days
    });
    if (user.provider) {
      return response.redirect(this.configService.get<string>('DOMAIN'));
    }

    return {
      accessToken: accessToken,
      success: 'login was successful',
      name: user.name,
      email: user.email,
      profile: user.image,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }

  async refresh(@Req() request: Request) {
    const token = request.cookies['refreshToken'];
    if (!token) {
      throw new BadRequestException('no refresh token provided');
    }

    return await this.verifyToken(token);
  }

  async verifyToken(token: string) {
    const result = this.jwtService.decode(token);
    if (new Date(Number(result?.exp) * 1000) <= new Date()) {
      throw new ForbiddenException('Token expired');
    }
    const user = await this.userService.findbyToken(token);
    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
    const newAccessToken = await this.createAccessToken(
      payload,
      this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
    );
    return {
      accessToken: newAccessToken,
      success: 'refresh successful',
      name: user.name,
      email: user.email,
      profile: user.image,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }
}
