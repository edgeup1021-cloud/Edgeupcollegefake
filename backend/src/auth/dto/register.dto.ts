import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  // For student registration
  @IsString()
  @IsOptional()
  admissionNo?: string;

  @IsString()
  @IsOptional()
  program?: string;

    @IsString()
    @IsOptional()
    section?: string;
  
    @IsString()
    @IsOptional()
    batch?: string;

  // For teacher registration
  @IsString()
  @IsOptional()
  designation?: string;

  @IsOptional()
  departmentId?: number;
}
