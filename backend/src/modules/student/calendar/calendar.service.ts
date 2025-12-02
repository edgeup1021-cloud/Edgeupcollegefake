import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CalendarEvent } from '../../../database/entities/student/calendar-event.entity';
import {
    CreateCalendarEventDto,
    UpdateCalendarEventDto,
    QueryCalendarEventDto,
} from './dto';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(CalendarEvent)
        private readonly calendarEventRepository: Repository<CalendarEvent>,
    ) { }

    async create(createDto: CreateCalendarEventDto): Promise<CalendarEvent> {
        const event = this.calendarEventRepository.create(createDto);
        return await this.calendarEventRepository.save(event);
    }

    async findAll(queryDto: QueryCalendarEventDto): Promise<CalendarEvent[]> {
        const query = this.calendarEventRepository.createQueryBuilder('event');

        if (queryDto.studentId) {
            query.andWhere('event.studentId = :studentId', {
                studentId: queryDto.studentId,
            });
        }

        if (queryDto.eventType) {
            query.andWhere('event.eventType = :eventType', {
                eventType: queryDto.eventType,
            });
        }

        if (queryDto.startDate && queryDto.endDate) {
            query.andWhere('event.eventDate BETWEEN :startDate AND :endDate', {
                startDate: queryDto.startDate,
                endDate: queryDto.endDate,
            });
        } else if (queryDto.startDate) {
            query.andWhere('event.eventDate >= :startDate', {
                startDate: queryDto.startDate,
            });
        } else if (queryDto.endDate) {
            query.andWhere('event.eventDate <= :endDate', {
                endDate: queryDto.endDate,
            });
        }

        if (queryDto.year && queryDto.month) {
            const startDate = new Date(queryDto.year, queryDto.month - 1, 1);
            const endDate = new Date(queryDto.year, queryDto.month, 0);
            query.andWhere('event.eventDate BETWEEN :startDate AND :endDate', {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            });
        }

        query.orderBy('event.eventDate', 'ASC');
        query.addOrderBy('event.eventTime', 'ASC');

        return await query.getMany();
    }

    async findOne(id: number): Promise<CalendarEvent> {
        const event = await this.calendarEventRepository.findOne({
            where: { id },
            relations: ['student'],
        });

        if (!event) {
            throw new NotFoundException(`Calendar event with ID ${id} not found`);
        }

        return event;
    }

    async findByDate(date: string, studentId?: number): Promise<CalendarEvent[]> {
        const query = this.calendarEventRepository.createQueryBuilder('event');

        query.where('event.eventDate = :date', { date });

        if (studentId) {
            query.andWhere('event.studentId = :studentId', { studentId });
        }

        query.orderBy('event.eventTime', 'ASC');

        return await query.getMany();
    }

    async findByMonth(
        year: number,
        month: number,
        studentId?: number,
    ): Promise<CalendarEvent[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const query = this.calendarEventRepository.createQueryBuilder('event');

        query.where('event.eventDate BETWEEN :startDate AND :endDate', {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        });

        if (studentId) {
            query.andWhere('event.studentId = :studentId', { studentId });
        }

        query.orderBy('event.eventDate', 'ASC');
        query.addOrderBy('event.eventTime', 'ASC');

        return await query.getMany();
    }

    async update(
        id: number,
        updateDto: UpdateCalendarEventDto,
    ): Promise<CalendarEvent> {
        const event = await this.findOne(id);

        Object.assign(event, updateDto);

        return await this.calendarEventRepository.save(event);
    }

    async remove(id: number): Promise<void> {
        const event = await this.findOne(id);
        await this.calendarEventRepository.remove(event);
    }
}
