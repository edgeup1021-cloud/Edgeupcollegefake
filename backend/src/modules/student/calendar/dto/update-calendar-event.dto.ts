import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarEventDto } from './create-calendar-event.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateCalendarEventDto extends PartialType(CreateCalendarEventDto) {
    @IsOptional()
    @IsNumber()
    studentId?: number;
}
