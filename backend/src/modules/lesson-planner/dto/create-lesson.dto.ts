import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  Min,
  Max,
  IsBoolean,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';
import { LessonClassVibe } from '../../../database/entities/teacher/standalone-lesson.entity';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  subject: string;

  @IsString()
  topic: string;

  @IsString()
  gradeLevel: string;

  @IsNumber()
  @Min(15)
  @Max(240)
  duration: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  classSize?: number;

  @IsOptional()
  @IsEnum(LessonClassVibe)
  classVibe?: LessonClassVibe;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  learningObjectives: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsOptional()
  @IsBoolean()
  isSubstituteLesson?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string;
}
