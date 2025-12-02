import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { AssignmentType } from '../../../../common/enums/status.enum';

export class CreateAssignmentDto {
  @IsNumber()
  courseOfferingId: number;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  weight?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxMarks?: number;

  @IsString()
  @IsOptional()
  @IsUrl()
  fileUrl?: string;
}
