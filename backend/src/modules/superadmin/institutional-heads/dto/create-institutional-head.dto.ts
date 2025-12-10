import { IsString, IsEmail, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateInstitutionalHeadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
