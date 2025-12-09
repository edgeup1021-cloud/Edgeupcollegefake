import { IsObject, IsOptional, IsString } from 'class-validator';

export class SaveResumeDto {
  @IsObject()
  resumeData: object;

  @IsOptional()
  @IsString()
  templateUsed?: string;
}
