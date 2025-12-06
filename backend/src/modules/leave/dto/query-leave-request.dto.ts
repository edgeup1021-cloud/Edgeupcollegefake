import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveStatus } from '../../../common/enums/status.enum';

export class QueryLeaveRequestDto {
  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  courseOfferingId?: number;
}
