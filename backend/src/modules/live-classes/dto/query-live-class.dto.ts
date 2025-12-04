import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { LiveClassStatus } from '../../../database/entities/teacher/teacher-live-class.entity';

export class QueryLiveClassDto {
  @IsOptional()
  @IsEnum(LiveClassStatus)
  status?: LiveClassStatus;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
