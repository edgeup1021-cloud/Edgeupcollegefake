import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { MentorshipStatus } from '../../../../database/entities/teacher/teacher-mentorship.entity';

export class UpdateMentorshipDto {
  @IsEnum(MentorshipStatus)
  @IsOptional()
  status?: MentorshipStatus;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
