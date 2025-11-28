import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherUser, TeacherCourseOffering } from '../../database/entities/teacher';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherUser)
    private readonly teacherRepository: Repository<TeacherUser>,
    @InjectRepository(TeacherCourseOffering)
    private readonly courseOfferingRepository: Repository<TeacherCourseOffering>,
  ) {}

  async findAll(): Promise<TeacherUser[]> {
    return this.teacherRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TeacherUser> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherUser> {
    const existingEmail = await this.teacherRepository.findOne({
      where: { email: createTeacherDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const teacher = this.teacherRepository.create(createTeacherDto);
    return this.teacherRepository.save(teacher);
  }

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherUser> {
    const teacher = await this.findOne(id);

    if (updateTeacherDto.email && updateTeacherDto.email !== teacher.email) {
      const existingEmail = await this.teacherRepository.findOne({
        where: { email: updateTeacherDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    Object.assign(teacher, updateTeacherDto);
    return this.teacherRepository.save(teacher);
  }

  async remove(id: number): Promise<TeacherUser> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
    return { ...teacher, id };
  }

  async getOverview() {
    const [totalTeachers, activeTeachers] = await Promise.all([
      this.teacherRepository.count(),
      this.teacherRepository.count({ where: { isActive: true } }),
    ]);

    return {
      totalTeachers,
      activeTeachers,
      inactiveTeachers: totalTeachers - activeTeachers,
    };
  }

  async getTeacherCourses(teacherId: number) {
    return this.courseOfferingRepository.find({
      where: { teacherId },
      relations: ['course'],
      order: { year: 'DESC', semester: 'ASC' },
    });
  }
}
