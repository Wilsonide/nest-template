/* eslint-disable prettier/prettier */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
      

    });
  }

  async validate(req: Request, payload: any) {
    const accessToken = req.get('authorization').replace('Bearer','').trim();
    console.log(accessToken);
    if (!accessToken) {
      throw new BadRequestException('Invalid or no access token')
    }
    const result = this.jwtService.decode(accessToken);
    if (new Date(Number(result?.exp) * 1000) <= new Date()) {
      throw new ForbiddenException('Token expired');
    }
    const user = this.userService.findbyEmail(payload.email)
    if (!user){
        console.log('User not found');
        throw new ForbiddenException('user not found')
    }
    console.log(payload);
    return { userId: payload.sub, email: payload.email }
  }
}
