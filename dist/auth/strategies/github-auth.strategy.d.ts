import { Profile, Strategy } from 'passport-github';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
declare const GithubStrategy_base: new (...args: any[]) => Strategy;
export declare class GithubStrategy extends GithubStrategy_base {
    private configService;
    private userService;
    constructor(configService: ConfigService, userService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<{
        provider: "github";
        id: string;
        email: string;
        name: string;
        picture: string;
    }>;
}
export {};
