import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ClassScheduleSlotDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class SyncCalendarDto {
  @IsNumber()
  curriculumPlanId: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  skipDates?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassScheduleSlotDto)
  classSchedule: ClassScheduleSlotDto[];
}
