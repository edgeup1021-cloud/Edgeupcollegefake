import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsDateString,
    IsOptional,
    MaxLength,
    IsNumber,
} from 'class-validator';
import { EventType } from '../../../../common/enums/event-type.enum';

export class CreateCalendarEventDto {
    @IsNumber()
    @IsNotEmpty()
    studentId: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsEnum(EventType)
    @IsNotEmpty()
    eventType: EventType;

    @IsDateString()
    @IsNotEmpty()
    eventDate: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    eventTime?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    subject?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    color?: string;
}
