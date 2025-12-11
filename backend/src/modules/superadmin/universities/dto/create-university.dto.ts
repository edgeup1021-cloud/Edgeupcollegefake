import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  MaxLength,
  ValidateIf,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InstitutionType, CollegeType } from '../../../../database/entities/superadmin/university.entity';

export class CreateInstitutionalHeadDto {
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

export class CreateUniversityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEnum(InstitutionType)
  @IsNotEmpty()
  institutionType: InstitutionType;

  @IsEnum(CollegeType)
  @ValidateIf((o) => o.institutionType === InstitutionType.COLLEGE)
  @IsNotEmpty({ message: 'College type is required when institution type is College' })
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
  @Type(() => CreateInstitutionalHeadDto)
  @IsOptional()
  institutionalHead?: CreateInstitutionalHeadDto;
}
