import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApplicationStatus } from '../../../../common/enums/status.enum';

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  companyName: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  companyLogo?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  position: string;

  @IsDateString()
  @IsNotEmpty()
  applicationDate: string;

  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status: ApplicationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  jobType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  salary?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  jobUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  interviewDate?: string;

  @IsDateString()
  @IsOptional()
  offerDeadline?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
