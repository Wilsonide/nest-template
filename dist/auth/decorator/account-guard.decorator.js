"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountGuard = exports.ACCOUNT_GUARD_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ACCOUNT_GUARD_KEY = 'AccountGuard';
const AccountGuard = () => (0, common_1.SetMetadata)(exports.ACCOUNT_GUARD_KEY, true);
exports.AccountGuard = AccountGuard;
//# sourceMappingURL=account-guard.decorator.js.map