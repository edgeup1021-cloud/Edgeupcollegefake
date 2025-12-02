import { IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../../../../common/enums/event-type.enum';

export class QueryCalendarEventDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    studentId?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsEnum(EventType)
    eventType?: EventType;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    year?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    month?: number;
}
