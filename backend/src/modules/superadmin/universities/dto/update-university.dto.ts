import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { InstitutionType, CollegeType } from '../../../../database/entities/superadmin/university.entity';

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
}
