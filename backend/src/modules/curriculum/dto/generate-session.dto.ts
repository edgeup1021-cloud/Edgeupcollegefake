import { IsNumber, Min } from 'class-validator';

export class GenerateSessionDto {
  @IsNumber()
  curriculumPlanId: number;

  @IsNumber()
  @Min(1)
  weekNumber: number;

  @IsNumber()
  @Min(1)
  sessionNumber: number;
}

export class GenerateAllSessionsDto {
  @IsNumber()
  curriculumPlanId: number;
}

export class GenerateToolkitDto {
  @IsNumber()
  sessionId: number;
}
