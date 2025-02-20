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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
const database_service_1 = require("../database/database.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, configService, databaseService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.databaseService = databaseService;
    }
    async logout(email) {
        return this.userService.updateUserRefresh_Token(email, '');
    }
    async createAccessToken(data, expires) {
        const payload = {
            email: data.email,
            sub: data.sub,
            emailVerified: data.emailVerified,
        };
        const accessToken = await this.jwtService
            .signAsync(payload, { expiresIn: expires })
            .catch((error) => {
            console.log(error);
        });
        return accessToken;
    }
    async createRefreshToken(data, expires) {
        const payload = {
            email: data.email,
            sub: data.sub,
            emailVerified: data.emailVerified,
        };
        const refreshToken = await this.jwtService
            .signAsync(payload, { expiresIn: expires })
            .catch((error) => {
            console.log(error);
        });
        return refreshToken;
    }
    async oauthCreateUser(params) {
        const { email, name, provider, picture } = params;
        const user = await this.userService.findbyEmail(email);
        if (user && user.provider === provider) {
            return await this.databaseService.user.update({
                where: {
                    email,
                },
                data: {
                    email,
                    emailVerified: true,
                    image: picture,
                    name,
                    provider: provider,
                },
            });
        }
        if (user && user.provider !== provider) {
            throw new common_1.ConflictException('email already in use with another provider');
        }
        await this.databaseService.user.create({
            data: {
                email,
                provider,
                emailVerified: true,
                image: picture,
                name,
            },
        });
    }
    async validateUser(email, pass) {
        const user = await this.userService.findbyEmail(email);
        if (!user) {
            return null;
        }
        try {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (!isMatch) {
                return null;
            }
            const { password, ...result } = user;
            return result;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async login(user, response) {
        const payload = {
            email: user.email,
            sub: user.id,
            emailVerified: user.emailVerified,
        };
        const refreshToken = await this.createRefreshToken(payload, this.configService.get('REFRESH_TOKEN_EXPIRE'));
        const accessToken = await this.createAccessToken(payload, this.configService.get('ACCESS_TOKEN_EXPIRE'));
        await this.userService.updateUserRefresh_Token(user.email, refreshToken);
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 24 * 1000,
        });
        if (user.provider) {
            return response.redirect(this.configService.get('DOMAIN'));
        }
        return {
            accessToken: accessToken,
            success: 'login was successful',
            name: user.name,
            email: user.email,
            profile: user.image,
            role: user.role,
            emailVerified: user.emailVerified,
        };
    }
    async refresh(request) {
        const token = request.cookies['refreshToken'];
        if (!token) {
            throw new common_1.BadRequestException('no refresh token provided');
        }
        return await this.verifyToken(token);
    }
    async verifyToken(token) {
        const result = this.jwtService.decode(token);
        if (new Date(Number(result?.exp) * 1000) <= new Date()) {
            throw new common_1.ForbiddenException('Token expired');
        }
        const user = await this.userService.findbyToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Invalid refresh token');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
        };
        const newAccessToken = await this.createAccessToken(payload, this.configService.get('ACCESS_TOKEN_EXPIRE'));
        return {
            accessToken: newAccessToken,
            success: 'refresh successful',
            name: user.name,
            email: user.email,
            profile: user.image,
            role: user.role,
            emailVerified: user.emailVerified,
        };
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(1, (0, common_1.Response)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "login", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "refresh", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        database_service_1.DatabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map