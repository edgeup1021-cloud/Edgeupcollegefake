import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MaxLength,
  ValidateIf,
  ValidateNested,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InstitutionType, CollegeType } from '../../../../database/entities/superadmin/university.entity';

export class UpdateInstitutionalHeadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateUniversityDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsEnum(InstitutionType)
  @IsOptional()
  institutionType?: InstitutionType;

  @IsEnum(CollegeType)
  @IsOptional()
  @ValidateIf((o) => o.institutionType === InstitutionType.COLLEGE)
  collegeType?: CollegeType | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsInt()
  @IsOptional()
  establishedYear?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => UpdateInstitutionalHeadDto)
  @IsOptional()
  institutionalHead?: UpdateInstitutionalHeadDto;
}
