import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userService;
    private jwtService;
    constructor(configService: ConfigService, userService: UsersService, jwtService: JwtService);
    validate(req: Request, payload: any): Promise<{
        userId: any;
        email: any;
    }>;
}
export {};
