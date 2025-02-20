import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private mailTransport;
    constructor(configService: ConfigService);
    sendVerificationEmail(email: string, token: string): Promise<{
        success: boolean;
    } | null>;
    sendnewpasswordmail(email: string, token: string): Promise<{
        success: boolean;
    } | null>;
}
