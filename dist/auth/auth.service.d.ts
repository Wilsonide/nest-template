import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Request, Response as ExpressResponse } from 'express';
import { DatabaseService } from 'src/database/database.service';
type Payload = {
    email: string;
    sub: number | string;
    emailVerified: boolean | null;
};
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    private databaseService;
    constructor(userService: UsersService, jwtService: JwtService, configService: ConfigService, databaseService: DatabaseService);
    logout(email: string): Promise<void>;
    createAccessToken(data: Payload, expires: string): Promise<string | void>;
    createRefreshToken(data: Payload, expires: string): Promise<string | void>;
    oauthCreateUser(params: any): Promise<{
        email: string;
        password: string | null;
        name: string | null;
        id: string;
        emailVerified: boolean | null;
        role: import(".prisma/client").$Enums.UserRole;
        image: string | null;
        isTwoFactorEnabled: boolean;
        refreshToken: string | null;
        provider: string | null;
    }>;
    validateUser(email: string, pass: string): Promise<{
        email: string;
        name: string | null;
        id: string;
        emailVerified: boolean | null;
        role: import(".prisma/client").$Enums.UserRole;
        image: string | null;
        isTwoFactorEnabled: boolean;
        refreshToken: string | null;
        provider: string | null;
    }>;
    login(user: any, response: ExpressResponse): Promise<void | {
        accessToken: string | void;
        success: string;
        name: any;
        email: any;
        profile: any;
        role: any;
        emailVerified: any;
    }>;
    refresh(request: Request): Promise<{
        accessToken: string | void;
        success: string;
        name: string;
        email: string;
        profile: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailVerified: boolean;
    }>;
    verifyToken(token: string): Promise<{
        accessToken: string | void;
        success: string;
        name: string;
        email: string;
        profile: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailVerified: boolean;
    }>;
}
export {};
