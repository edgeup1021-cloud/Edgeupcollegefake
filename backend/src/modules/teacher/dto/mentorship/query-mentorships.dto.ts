import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { MentorshipStatus } from '../../../../database/entities/teacher/teacher-mentorship.entity';

export class QueryMentorshipsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  teacherId?: number;

  @IsOptional()
  @IsEnum(MentorshipStatus)
  status?: MentorshipStatus;
}
