import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { StudentUser } from './student-user.entity';
import { EventType } from '../../../common/enums/event-type.enum';

@Entity('student_calendar_events')
export class CalendarEvent {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'student_id', type: 'bigint', unsigned: true })
    studentId: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({
        name: 'event_type',
        type: 'enum',
        enum: EventType,
    })
    eventType: EventType;

    @Column({ name: 'event_date', type: 'date' })
    eventDate: Date;

    @Column({ name: 'event_time', type: 'varchar', length: 20, nullable: true })
    eventTime: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    subject: string | null;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    color: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => StudentUser)
    @JoinColumn({ name: 'student_id' })
    student: StudentUser;
}
