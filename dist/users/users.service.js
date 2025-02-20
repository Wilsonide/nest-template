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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const database_service_1 = require("../database/database.service");
const register_user_dto_1 = require("./dto/register-user.dto");
const email_service_1 = require("../message/email.service");
const verification_service_1 = require("../verification/verification.service");
let UsersService = class UsersService {
    constructor(databaseService, emailService, verifyService) {
        this.databaseService = databaseService;
        this.emailService = emailService;
        this.verifyService = verifyService;
    }
    async updateUserRefresh_Token(email, refresh_token) {
        await this.databaseService.user.update({
            where: { email },
            data: { refreshToken: refresh_token },
        });
    }
    async create(dto) {
        const { email, password, name } = dto;
        const user = await this.findbyEmail(email);
        if (user) {
            return { error: 'user already exists' };
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await this.databaseService.user.create({
            data: {
                email,
                password: hashPassword,
                name,
            },
        });
        delete newUser.password;
        const token = await this.verifyService.createVerificationToken(newUser.email);
        await this.emailService.sendVerificationEmail(newUser.email, token);
        return { success: 'confirmation email sent' };
    }
    async findbyEmail(email) {
        const user = await this.databaseService.user.findUnique({
            where: { email },
        });
        return user;
    }
    async getAll() {
        const user = await this.databaseService.user.findMany();
        return user;
    }
    async findbyToken(token) {
        const user = await this.databaseService.user.findFirst({
            where: { refreshToken: token },
        });
        return user;
    }
    async findMany() {
        return await this.databaseService.user.findMany();
    }
};
exports.UsersService = UsersService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.registerUserDto]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "create", null);
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        email_service_1.EmailService,
        verification_service_1.VerificationService])
], UsersService);
//# sourceMappingURL=users.service.js.map