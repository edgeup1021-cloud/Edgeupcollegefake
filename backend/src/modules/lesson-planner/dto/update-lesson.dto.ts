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
} from 'class-validator';
import {
  LessonClassVibe,
  LessonStatus,
} from '../../../database/entities/teacher/standalone-lesson.entity';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(240)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  classSize?: number;

  @IsOptional()
  @IsEnum(LessonClassVibe)
  classVibe?: LessonClassVibe;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningObjectives?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @IsOptional()
  @IsBoolean()
  isSubstituteLesson?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @IsOptional()
  @IsString()
  teacherNotes?: string;
}

export class UpdateLessonResourceDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  teacherRating?: number;

  @IsOptional()
  @IsString()
  teacherNotes?: string;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}

export class ImportFromCurriculumDto {
  @IsNumber()
  curriculumSessionId: number;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @IsOptional()
  @IsBoolean()
  isSubstituteLesson?: boolean;
}
