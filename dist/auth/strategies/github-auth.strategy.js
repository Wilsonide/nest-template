"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubStrategy = void 0;
const passport_github_1 = require("passport-github");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
const config_1 = require("@nestjs/config");
let GithubStrategy = class GithubStrategy extends (0, passport_1.PassportStrategy)(passport_github_1.Strategy, 'github') {
    constructor(configService, userService) {
        super({
            clientID: configService.get('GITHUB_CLIENT_ID'),
            clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
            callbackURL: configService.get('GITHUB_CALLBACK_URL'),
            scope: ['public_profile'],
        });
        this.configService = configService;
        this.userService = userService;
    }
    async validate(accessToken, refreshToken, profile) {
        const { id, displayName, emails, photos, provider } = profile;
        const user = {
            provider,
            id: id,
            email: emails[0].value,
            name: displayName,
            picture: photos[0].value,
        };
        return user;
    }
};
exports.GithubStrategy = GithubStrategy;
exports.GithubStrategy = GithubStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], GithubStrategy);
//# sourceMappingURL=github-auth.strategy.js.map