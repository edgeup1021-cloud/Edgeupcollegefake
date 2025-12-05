import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class ScoreResumeByUrlDto {
  @IsUrl()
  @IsNotEmpty()
  resumeUrl: string;

  @IsString()
  @IsOptional()
  jobDescription?: string;
}

export class ScoreResumeByTextDto {
  @IsString()
  @IsNotEmpty()
  resumeText: string;

  @IsString()
  @IsOptional()
  jobDescription?: string;
}

export class ResumeScoreResponseDto {
  success: boolean;
  data?: {
    score: number;
    reason: string;
    overallScore: number;
    keywordMatch: number;
    formatScore: number;
    readabilityScore: number;
    suggestions: string[];
    missingKeywords: string[];
    strongPoints: string[];
  };
  error?: string;
}
