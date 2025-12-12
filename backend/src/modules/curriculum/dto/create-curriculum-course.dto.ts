import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import {
  SessionType,
  ClassVibe,
  TeacherChallenge,
} from '../../../database/entities/teacher/curriculum-course.entity';

export class CreateCurriculumCourseDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  courseName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  courseCode?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  subject: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  department?: string;

  @IsNumber()
  @Min(1)
  @Max(52)
  totalWeeks: number;

  @IsNumber()
  @Min(1)
  @Max(40)
  hoursPerWeek: number;

  @IsNumber()
  @Min(30)
  @Max(180)
  sessionDuration: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  sessionsPerWeek: number;

  @IsEnum(SessionType)
  sessionType: SessionType;

  @IsNumber()
  @Min(1)
  @Max(500)
  classSize: number;

  @IsEnum(ClassVibe)
  classVibe: ClassVibe;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  studentLevel?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  outcomes: string[];

  @IsOptional()
  @IsEnum(TeacherChallenge)
  primaryChallenge?: TeacherChallenge;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  additionalNotes?: string;
}
