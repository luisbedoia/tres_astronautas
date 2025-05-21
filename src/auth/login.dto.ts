import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(3) password: string;
}
