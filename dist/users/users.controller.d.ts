import { UsersService } from './users.service';
import { registerUserDto } from './dto/register-user.dto';
import { VerificationService } from 'src/verification/verification.service';
export declare class UsersController {
    private readonly usersService;
    private verifyService;
    constructor(usersService: UsersService, verifyService: VerificationService);
    create(dto: registerUserDto): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
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
    verifyEmail(token: string): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
}
