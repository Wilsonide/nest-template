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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(configService, userService, jwtService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET'),
            passReqToCallback: true,
        });
        this.configService = configService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validate(req, payload) {
        const accessToken = req.get('authorization').replace('Bearer', '').trim();
        console.log(accessToken);
        if (!accessToken) {
            throw new common_1.BadRequestException('Invalid or no access token');
        }
        const result = this.jwtService.decode(accessToken);
        if (new Date(Number(result?.exp) * 1000) <= new Date()) {
            throw new common_1.ForbiddenException('Token expired');
        }
        const user = this.userService.findbyEmail(payload.email);
        if (!user) {
            console.log('User not found');
            throw new common_1.ForbiddenException('user not found');
        }
        console.log(payload);
        return { userId: payload.sub, email: payload.email };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map