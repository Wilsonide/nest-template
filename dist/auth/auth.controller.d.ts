import { AuthService } from './auth.service';
import { registerUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/message/email.service';
import { VerificationService } from 'src/verification/verification.service';
import { newPasswordDto } from 'src/users/dto/new-password.dto';
import { resetPasswordDto } from 'src/users/dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    private userService;
    private configService;
    private emailService;
    private verifyService;
    constructor(authService: AuthService, userService: UsersService, configService: ConfigService, emailService: EmailService, verifyService: VerificationService);
    logout(req: ExpressRequest): void;
    signup(dto: registerUserDto): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
    signin(req: ExpressRequest, res: ExpressResponse): Promise<void | {
        accessToken: string | void;
        success: string;
        name: any;
        email: any;
        profile: any;
        role: any;
        emailVerified: any;
    }>;
    refresh(req: ExpressRequest): Promise<{
        accessToken: string | void;
        success: string;
        name: string;
        email: string;
        profile: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailVerified: boolean;
    }>;
    githublogin(): Promise<void>;
    githubAuthCallback(req: ExpressRequest, res: ExpressResponse): Promise<void | {
        accessToken: string | void;
        success: string;
        name: any;
        email: any;
        profile: any;
        role: any;
        emailVerified: any;
    }>;
    googlelogin(): Promise<void>;
    googlebAuthCallback(req: ExpressRequest, res: ExpressResponse): Promise<void | {
        accessToken: string | void;
        success: string;
        name: any;
        email: any;
        profile: any;
        role: any;
        emailVerified: any;
    }>;
    newPassword(dto: newPasswordDto): Promise<"password does not match" | {
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
    resetPassword(dto: resetPasswordDto): Promise<{
        success: boolean;
    }>;
}
