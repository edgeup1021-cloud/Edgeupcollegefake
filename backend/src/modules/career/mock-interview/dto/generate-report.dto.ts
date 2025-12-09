import { IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessageDto } from './chat.dto';

export class InterviewAssessmentDto {
  @IsString()
  spokenOutro: string;

  @IsString()
  overallAssessment: string;

  @IsArray()
  @IsString({ each: true })
  strengths: string[];

  @IsArray()
  @IsString({ each: true })
  areasForImprovement: string[];

  @IsNumber()
  technicalScore: number;

  @IsNumber()
  communicationScore: number;

  @IsNumber()
  problemSolvingScore: number;
}

export class GenerateReportRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @ValidateNested()
  @Type(() => InterviewAssessmentDto)
  assessment: InterviewAssessmentDto;

  @IsString()
  language: string;

  @IsString()
  startTime: string;
}
