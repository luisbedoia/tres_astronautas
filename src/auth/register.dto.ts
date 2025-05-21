import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(3) password: string;
  @IsString() fullName: string;
}
