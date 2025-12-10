import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateInstitutionalHeadDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
