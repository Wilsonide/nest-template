"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const database_module_1 = require("../database/database.module");
const users_module_1 = require("../users/users.module");
const local_strategy_1 = require("./strategies/local.strategy");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const github_auth_strategy_1 = require("./strategies/github-auth.strategy");
const google_auth_strategy_1 = require("./strategies/google-auth.strategy");
const google_auth_config_1 = require("./config/google-auth.config");
const github_auth_config_1 = require("./config/github-auth.config");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const verification_module_1 = require("../verification/verification.module");
const emails_module_1 = require("../message/emails.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {},
                }),
            }),
            config_1.ConfigModule.forFeature(github_auth_config_1.default),
            config_1.ConfigModule.forFeature(google_auth_config_1.default),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            passport_1.PassportModule,
            verification_module_1.VerificationModule,
            emails_module_1.EmailsModule,
        ],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            google_auth_strategy_1.GoogleStrategy,
            github_auth_strategy_1.GithubStrategy,
            jwt_strategy_1.JwtStrategy,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map