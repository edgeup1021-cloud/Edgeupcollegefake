import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateResumeDto {
  @IsOptional()
  @IsObject()
  resumeData?: object;

  @IsOptional()
  @IsString()
  templateUsed?: string;
}
