/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const ACCOUNT_GUARD_KEY = 'AccountGuard'
export const AccountGuard = () => SetMetadata(ACCOUNT_GUARD_KEY, true)