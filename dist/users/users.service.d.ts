import { DatabaseService } from 'src/database/database.service';
import { registerUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/message/email.service';
import { VerificationService } from 'src/verification/verification.service';
export declare class UsersService {
    private readonly databaseService;
    private emailService;
    private verifyService;
    constructor(databaseService: DatabaseService, emailService: EmailService, verifyService: VerificationService);
    updateUserRefresh_Token(email: string, refresh_token: string): Promise<void>;
    create(dto: registerUserDto): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
    findbyEmail(email: string): Promise<{
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
    getAll(): Promise<{
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
    }[]>;
    findbyToken(token: string): Promise<{
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
    findMany(): Promise<{
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
    }[]>;
}
