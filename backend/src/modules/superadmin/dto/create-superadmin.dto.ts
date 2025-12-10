import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateSuperadminDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
