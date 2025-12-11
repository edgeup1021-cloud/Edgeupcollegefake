import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PublicationStatus } from '../../../../database/entities/teacher/teacher-publication.entity';

export class QueryPublicationsDto {
  @IsOptional()
  @Type(() => Number)
  teacherId?: number;

  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
