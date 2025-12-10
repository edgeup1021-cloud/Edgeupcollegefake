import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { InstitutionType, CollegeType } from '../../../../database/entities/superadmin/university.entity';

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
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

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
