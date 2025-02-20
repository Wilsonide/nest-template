import { DatabaseService } from 'src/database/database.service';
import { newPasswordDto } from 'src/users/dto/new-password.dto';
export declare class VerificationService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    getTokenByToken(token: string): Promise<{
        email: string;
        token: string;
        id: string;
        expires: Date;
    }>;
    findUserbyEmail(email: string): Promise<{
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
    createVerificationToken(mail: string): Promise<string>;
    newPassword(dto: newPasswordDto): Promise<"password does not match" | {
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
    verifyEmail(token: string): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
    getTokenByEmail(email: string): Promise<{
        email: string;
        token: string;
        id: string;
        expires: Date;
    }>;
    getPasswordTokenByToken(token: string): Promise<{
        email: string;
        token: string;
        id: string;
        expires: Date;
    }>;
    getPasswordTokenByEmail(email: string): Promise<{
        email: string;
        token: string;
        id: string;
        expires: Date;
    }>;
    createPasswordToken(email: string): Promise<string>;
}
