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
exports.AccountGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../decorator/public.decorator");
const account_guard_decorator_1 = require("../decorator/account-guard.decorator");
let AccountGuard = class AccountGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const AccountGuard = this.reflector.getAllAndOverride(account_guard_decorator_1.ACCOUNT_GUARD_KEY, [context.getHandler(), context.getClass()]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (isPublic) {
            return true;
        }
        if (AccountGuard) {
            if (user.emailVerified !== true) {
                throw new common_1.UnauthorizedException('Account not verified');
            }
        }
        return user.emailVerified === true;
    }
};
exports.AccountGuard = AccountGuard;
exports.AccountGuard = AccountGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AccountGuard);
//# sourceMappingURL=account.guard.guard.js.map