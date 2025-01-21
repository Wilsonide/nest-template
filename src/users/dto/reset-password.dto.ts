/* eslint-disable prettier/prettier */
import { IsEmail } from 'class-validator';

export class resetPasswordDto {
  @IsEmail()
  email: string;
}
