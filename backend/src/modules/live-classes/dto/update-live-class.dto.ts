import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateLiveClassDto } from './create-live-class.dto';
import { LiveClassStatus } from '../../../database/entities/teacher/teacher-live-class.entity';

export class UpdateLiveClassDto extends PartialType(CreateLiveClassDto) {
  @IsOptional()
  @IsEnum(LiveClassStatus)
  status?: LiveClassStatus;
}
