import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
    CreateCalendarEventDto,
    UpdateCalendarEventDto,
    QueryCalendarEventDto,
} from './dto';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Post('events')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createDto: CreateCalendarEventDto) {
        return this.calendarService.create(createDto);
    }

    @Get('events')
    findAll(@Query() queryDto: QueryCalendarEventDto) {
        return this.calendarService.findAll(queryDto);
    }

    @Get('events/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.calendarService.findOne(id);
    }

    @Get('events/date/:date')
    findByDate(
        @Param('date') date: string,
        @Query('studentId', new ParseIntPipe({ optional: true })) studentId?: number,
    ) {
        return this.calendarService.findByDate(date, studentId);
    }

    @Get('events/month/:year/:month')
    findByMonth(
        @Param('year', ParseIntPipe) year: number,
        @Param('month', ParseIntPipe) month: number,
        @Query('studentId', new ParseIntPipe({ optional: true })) studentId?: number,
    ) {
        return this.calendarService.findByMonth(year, month, studentId);
    }

    @Patch('events/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateCalendarEventDto,
    ) {
        return this.calendarService.update(id, updateDto);
    }

    @Delete('events/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.calendarService.remove(id);
    }
}
