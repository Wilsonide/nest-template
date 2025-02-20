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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_user_dto_1 = require("../users/dto/register-user.dto");
const users_service_1 = require("../users/users.service");
const public_decorator_1 = require("./decorator/public.decorator");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const github_auth_guard_1 = require("./guards/github-auth.guard");
const google_auth_guard_1 = require("./guards/google-auth.guard");
const config_1 = require("@nestjs/config");
const email_service_1 = require("../message/email.service");
const verification_service_1 = require("../verification/verification.service");
const new_password_dto_1 = require("../users/dto/new-password.dto");
const reset_password_dto_1 = require("../users/dto/reset-password.dto");
let AuthController = class AuthController {
    constructor(authService, userService, configService, emailService, verifyService) {
        this.authService = authService;
        this.userService = userService;
        this.configService = configService;
        this.emailService = emailService;
        this.verifyService = verifyService;
    }
    logout(req) {
        this.authService.logout(req.user['email']);
    }
    signup(dto) {
        return this.userService.create(dto);
    }
    signin(req, res) {
        return this.authService.login(req.user, res);
    }
    refresh(req) {
        return this.authService.refresh(req);
    }
    async githublogin() { }
    async githubAuthCallback(req, res) {
        console.log(req.user);
        await this.authService.oauthCreateUser(req.user);
        return this.authService.login(req.user, res);
    }
    async googlelogin() { }
    async googlebAuthCallback(req, res) {
        console.log(req.user);
        await this.authService.oauthCreateUser(req.user);
        return this.authService.login(req.user, res);
    }
    async newPassword(dto) {
        const result = await this.verifyService.newPassword(dto);
        return result;
    }
    async resetPassword(dto) {
        const token = await this.verifyService.createPasswordToken(dto.email);
        return await this.emailService.sendnewpasswordmail(dto.email, token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.registerUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('github'),
    (0, common_1.UseGuards)(github_auth_guard_1.GithubAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githublogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('callback/github'),
    (0, common_1.UseGuards)(github_auth_guard_1.GithubAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuthCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googlelogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('callback/google'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googlebAuthCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('new-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [new_password_dto_1.newPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "newPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.resetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        config_1.ConfigService,
        email_service_1.EmailService,
        verification_service_1.VerificationService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map