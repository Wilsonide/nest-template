/* eslint-disable prettier/prettier */
import { IsDefined, IsIn, IsString, IsStrongPassword, MinLength, ValidateIf } from 'class-validator';

export class newPasswordDto {

  @IsString()
  @IsDefined()
  @MinLength(3)
  @IsStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  @IsDefined()
  @IsStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsIn([Math.random()], {
    message: 'Password does not match'
  })
  @ValidateIf((object: any) => object.password !== object.confirmPassword)
  confirmPassword: string;

  @IsString()
  @IsDefined()
  token: string;
}