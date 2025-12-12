import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export enum QuestionType {
  MCQ = 'mcq',
  DESCRIPTIVE = 'descriptive',
}

export enum DescriptiveType {
  VERY_SHORT = 'very_short',
  SHORT = 'short',
  LONG_ESSAY = 'long_essay',
}

export enum PaperType {
  CORE = 'Core',
  ELECTIVE = 'Elective',
}

export class GenerateQuestionsDto {
  @IsString()
  @MinLength(2, { message: 'Subject must be at least 2 characters long' })
  @MaxLength(200, { message: 'Subject must not exceed 200 characters' })
  subject: string;

  @IsString()
  @MinLength(2, { message: 'Topic must be at least 2 characters long' })
  @MaxLength(200, { message: 'Topic must not exceed 200 characters' })
  topic: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Subtopic must not exceed 200 characters' })
  subtopic?: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Must generate at least 1 question' })
  @Max(20, { message: 'Cannot generate more than 20 questions at once' })
  num_questions?: number;

  @IsEnum(QuestionType, { message: 'Invalid question type' })
  @IsOptional()
  question_type?: QuestionType;

  @IsEnum(DescriptiveType, { message: 'Invalid descriptive type' })
  @IsOptional()
  descriptive_type?: DescriptiveType;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'University name must not exceed 255 characters' })
  university?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Course must not exceed 100 characters' })
  course?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Department must not exceed 255 characters' })
  department?: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Semester must be at least 1' })
  @Max(6, { message: 'Semester must not exceed 6' })
  semester?: number;

  @IsEnum(PaperType, { message: 'Invalid paper type' })
  @IsOptional()
  paper_type?: PaperType;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Instructions must not exceed 500 characters' })
  instructions?: string;
}
