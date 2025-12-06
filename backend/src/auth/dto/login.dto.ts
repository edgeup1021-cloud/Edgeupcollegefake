import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { PortalType } from '../interfaces/jwt-payload.interface';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(PortalType)
  @IsNotEmpty()
  portalType: PortalType;
}
