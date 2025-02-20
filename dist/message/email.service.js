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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = require("nodemailer");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.mailTransport = (0, nodemailer_1.createTransport)({
            service: 'gmail',
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendVerificationEmail(email, token) {
        const confirmLink = `${process.env.DOMAIN}/auth/verification?token=${token}`;
        const mailOptions = {
            from: {
                name: this.configService.get('MAIL_NAME_DEFAULT'),
                address: this.configService.get('MAIL_SENDER_DEFAULT'),
            },
            to: email,
            subject: 'Verification email',
            html: `<p>click <a href='${confirmLink}'>here</a> to confirm email</p>`,
        };
        try {
            await this.mailTransport.sendMail(mailOptions);
            return { success: true };
        }
        catch (err) {
            console.error('Error sending email:', err);
            return null;
        }
    }
    async sendnewpasswordmail(email, token) {
        const resetLink = `${process.env.DOMAIN}/auth/new-password?token=${token}`;
        const mailOptions = {
            from: {
                name: this.configService.get('MAIL_NAME_DEFAULT'),
                address: this.configService.get('MAIL_SENDER_DEFAULT'),
            },
            to: email,
            subject: 'Reset Password email',
            html: `<p>click <a href='${resetLink}'>here</a> to reset your password</p>`,
        };
        try {
            await this.mailTransport.sendMail(mailOptions);
            return { success: true };
        }
        catch (err) {
            console.error('Error sending email:', err);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map