import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if email or admission number already exists
    const existingByEmail = await this.studentRepository.findOne({
      where: { email: createStudentDto.email },
    });
    if (existingByEmail) {
      throw new ConflictException('A student with this email already exists');
    }

    const existingByAdmission = await this.studentRepository.findOne({
      where: { admissionNo: createStudentDto.admissionNo },
    });
    if (existingByAdmission) {
      throw new ConflictException('A student with this admission number already exists');
    }

    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    // Check email uniqueness if being changed
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const emailExists = await this.studentRepository.findOne({
        where: { email: updateStudentDto.email },
      });
      if (emailExists) {
        throw new ConflictException('This email is already in use');
      }
    }

    // Check admission number uniqueness if being changed
    if (updateStudentDto.admissionNo && updateStudentDto.admissionNo !== student.admissionNo) {
      const admissionExists = await this.studentRepository.findOne({
        where: { admissionNo: updateStudentDto.admissionNo },
      });
      if (admissionExists) {
        throw new ConflictException('This admission number is already in use');
      }
    }

    Object.assign(student, updateStudentDto);
    return this.studentRepository.save(student);
  }

  async remove(id: number): Promise<Student> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
    return { ...student, id };
  }

  async getOverview(): Promise<{
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
    graduatedStudents: number;
  }> {
    const totalStudents = await this.studentRepository.count();

    const activeStudents = await this.studentRepository.count({
      where: { status: 'active' },
    });

    const suspendedStudents = await this.studentRepository.count({
      where: { status: 'suspended' },
    });

    const graduatedStudents = await this.studentRepository.count({
      where: { status: 'graduated' },
    });

    return {
      totalStudents,
      activeStudents,
      suspendedStudents,
      graduatedStudents,
    };
  }
}
