import { IsNumber, IsString, IsOptional, IsUrl } from 'class-validator';

export class SubmitAssignmentDto {
  @IsNumber()
  assignmentId: number;

  @IsString()
  @IsOptional()
  @IsUrl()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
