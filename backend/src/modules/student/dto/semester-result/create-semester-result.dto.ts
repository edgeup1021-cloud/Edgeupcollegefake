import { IsString, IsInt, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SubjectGradeDto {
  @IsInt()
  courseOfferingId: number;

  @IsInt()
  @IsOptional()
  gradeId?: number;

  @IsString()
  subjectCode: string;

  @IsString()
  subjectName: string;

  @IsInt()
  credits: number;

  @IsInt()
  internalMarks: number;

  @IsInt()
  externalMarks: number;

  @IsInt()
  totalMarks: number;

  @IsInt()
  maxMarks: number;

  @IsString()
  grade: string;

  @IsInt()
  gradePoints: number;
}

export class CreateSemesterResultDto {
  @IsInt()
  studentId: number;

  @IsString()
  semester: string;

  @IsString()
  academicYear: string;

  @IsString()
  session: string;

  @IsInt()
  totalCredits: number;

  @IsInt()
  earnedCredits: number;

  @IsDateString()
  @IsOptional()
  resultDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectGradeDto)
  subjects: SubjectGradeDto[];
}
