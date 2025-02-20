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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const uuid_1 = require("uuid");
const bcrypt = require("bcryptjs");
let VerificationService = class VerificationService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getTokenByToken(token) {
        try {
            const verifyToken = await this.databaseService.verificationToken.findUnique({
                where: { token },
            });
            return verifyToken;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUserbyEmail(email) {
        const user = await this.databaseService.user.findUnique({
            where: { email },
        });
        return user;
    }
    async createVerificationToken(mail) {
        const token = (0, uuid_1.v4)();
        const expires = new Date(new Date().getTime() + 3600 * 1000);
        const existingToken = await this.getTokenByEmail(mail);
        if (existingToken) {
            await this.databaseService.verificationToken.delete({
                where: { id: existingToken.id },
            });
        }
        await this.databaseService.verificationToken.create({
            data: {
                token,
                expires,
                email: mail,
            },
        });
        return token;
    }
    async newPassword(dto) {
        const { password, confirmPassword, token } = dto;
        if (!token) {
            return { error: 'Missing Token' };
        }
        if (!password || !confirmPassword)
            return { error: 'Invalid fields' };
        if (confirmPassword !== password) {
            return 'password does not match';
        }
        const existingToken = await this.getPasswordTokenByToken(token);
        if (!existingToken) {
            return { error: 'Invalid token' };
        }
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return { error: 'token has expired' };
        }
        const existingUser = await this.findUserbyEmail(existingToken.email);
        if (!existingUser) {
            return { error: 'Email does not exist' };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.databaseService.user.update({
            where: { id: existingUser.id },
            data: {
                password: hashedPassword,
            },
        });
        await this.databaseService.passordResetToken.delete({
            where: { id: existingToken.id },
        });
        return { success: 'Password updated successfully' };
    }
    async verifyEmail(token) {
        const existingToken = await this.getTokenByToken(token);
        if (!existingToken) {
            return { error: 'token not found' };
        }
        const existingUser = await this.findUserbyEmail(existingToken.email);
        if (!existingUser)
            return { error: 'token not found' };
        await this.databaseService.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: true,
                email: existingToken.email,
            },
        });
        return { success: 'email verified' };
    }
    async getTokenByEmail(email) {
        try {
            const verifyToken = await this.databaseService.verificationToken.findFirst({
                where: { email },
            });
            return verifyToken;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async getPasswordTokenByToken(token) {
        try {
            const verifyToken = await this.databaseService.passordResetToken.findUnique({
                where: { token },
            });
            return verifyToken;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async getPasswordTokenByEmail(email) {
        try {
            const verifyToken = await this.databaseService.passordResetToken.findFirst({
                where: { email },
            });
            return verifyToken;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async createPasswordToken(email) {
        const token = (0, uuid_1.v4)();
        const expires = new Date(new Date().getTime() + 3600 * 1000);
        const existingToken = await this.getPasswordTokenByEmail(email);
        if (existingToken) {
            await this.databaseService.passordResetToken.delete({
                where: { id: existingToken.id },
            });
        }
        await this.databaseService.passordResetToken.create({
            data: {
                email,
                token,
                expires,
            },
        });
        return token;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map