import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { ACCOUNT_GUARD_KEY } from '../decorator/account-guard.decorator';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const AccountGuard = this.reflector.getAllAndOverride<boolean>(
      ACCOUNT_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (isPublic) {
      return true;
    }
    if (AccountGuard) {
      if (user.emailVerified !== true) {
        throw new UnauthorizedException('Account not verified');
      }
    }
    return user.emailVerified === true;
  }
}
