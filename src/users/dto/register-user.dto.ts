import { IsOptional, IsString, IsEmail } from 'class-validator';

export class registerUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
