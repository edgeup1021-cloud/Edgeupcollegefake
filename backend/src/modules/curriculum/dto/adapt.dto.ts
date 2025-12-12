import { IsNumber, IsObject, IsOptional, IsEnum } from 'class-validator';
import { AdaptationTrigger } from '../../../database/entities/teacher/curriculum-adaptation.entity';

export class AdaptDto {
  @IsNumber()
  curriculumPlanId: number;

  @IsEnum(AdaptationTrigger)
  triggerType: AdaptationTrigger;

  @IsObject()
  triggerData: {
    quizResults?: { topic: string; averageScore: number }[];
    feedback?: { type: string; count: number; comments: string[] }[];
    behindBy?: number;
    request?: string;
  };
}

export class RespondToAdaptationDto {
  @IsNumber()
  adaptationId: number;

  @IsEnum(['ACCEPTED', 'REJECTED', 'PARTIALLY_ACCEPTED'])
  response: 'ACCEPTED' | 'REJECTED' | 'PARTIALLY_ACCEPTED';

  @IsOptional()
  @IsObject()
  customizations?: Record<string, any>;
}
