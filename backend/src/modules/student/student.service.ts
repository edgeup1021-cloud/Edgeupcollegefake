import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentUser } from '../../database/entities/student';
import { StudentStatus } from '../../common/enums/status.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentOverviewDto } from './dto/student-overview.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentUser)
    private readonly studentRepository: Repository<StudentUser>,
  ) {}

  async findAll(): Promise<StudentUser[]> {
    return this.studentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<StudentUser> {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentUser> {
    // Check for duplicates
    const existingEmail = await this.studentRepository.findOne({
      where: { email: createStudentDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingAdmission = await this.studentRepository.findOne({
      where: { admissionNo: createStudentDto.admissionNo },
    });
    if (existingAdmission) {
      throw new ConflictException('Admission number already exists');
    }

    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentUser> {
    const student = await this.findOne(id);

    // Check email uniqueness if being updated
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const existingEmail = await this.studentRepository.findOne({
        where: { email: updateStudentDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    // Check admission number uniqueness if being updated
    if (
      updateStudentDto.admissionNo &&
      updateStudentDto.admissionNo !== student.admissionNo
    ) {
      const existingAdmission = await this.studentRepository.findOne({
        where: { admissionNo: updateStudentDto.admissionNo },
      });
      if (existingAdmission) {
        throw new ConflictException('Admission number already in use');
      }
    }

    Object.assign(student, updateStudentDto);
    return this.studentRepository.save(student);
  }

  async remove(id: number): Promise<StudentUser> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
    // Return the student data (TypeORM removes the id after deletion)
    return { ...student, id };
  }

  async getOverview(): Promise<StudentOverviewDto> {
    const [totalStudents, activeStudents, suspendedStudents, graduatedStudents] =
      await Promise.all([
        this.studentRepository.count(),
        this.studentRepository.count({
          where: { status: StudentStatus.ACTIVE },
        }),
        this.studentRepository.count({
          where: { status: StudentStatus.SUSPENDED },
        }),
        this.studentRepository.count({
          where: { status: StudentStatus.GRADUATED },
        }),
      ]);

    return {
      totalStudents,
      activeStudents,
      suspendedStudents,
      graduatedStudents,
    };
  }
}
