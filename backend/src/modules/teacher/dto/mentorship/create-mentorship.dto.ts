import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateMentorshipDto {
  @IsInt()
  studentId: number;

  @IsDateString()
  @IsOptional()
  assignedDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
