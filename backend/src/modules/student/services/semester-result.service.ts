import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSemesterResult } from '../../../database/entities/student/student-semester-result.entity';
import { StudentGrade } from '../../../database/entities/student/student-grade.entity';
import { TeacherCourseOffering } from '../../../database/entities/teacher/teacher-course-offering.entity';
import {
  CreateSemesterResultDto,
  UpdateSemesterResultDto,
} from '../dto/semester-result';

@Injectable()
export class SemesterResultService {
  constructor(
    @InjectRepository(StudentSemesterResult)
    private readonly semesterResultRepository: Repository<StudentSemesterResult>,
    @InjectRepository(StudentGrade)
    private readonly gradeRepository: Repository<StudentGrade>,
    @InjectRepository(TeacherCourseOffering)
    private readonly courseOfferingRepository: Repository<TeacherCourseOffering>,
  ) {}

  // Helper function to convert percentage to 10-point CGPA with grade letter
  private getGradeInfo(percentage: number): {
    letter: string;
    points: number;
  } {
    if (percentage >= 90) return { letter: 'A+', points: 10 };
    if (percentage >= 80) return { letter: 'A', points: 9 };
    if (percentage >= 70) return { letter: 'B+', points: 8 };
    if (percentage >= 60) return { letter: 'B', points: 7 };
    if (percentage >= 55) return { letter: 'C+', points: 6 };
    if (percentage >= 50) return { letter: 'C', points: 5 };
    if (percentage >= 40) return { letter: 'D', points: 4 };
    return { letter: 'F', points: 0 };
  }

  // Create semester result
  async createSemesterResult(dto: CreateSemesterResultDto) {
    // Create or update semester result
    const semesterResult = this.semesterResultRepository.create({
      studentId: dto.studentId,
      semester: dto.semester,
      academicYear: dto.academicYear,
      session: dto.session,
      totalCredits: dto.totalCredits,
      earnedCredits: dto.earnedCredits,
      resultDate: dto.resultDate ? new Date(dto.resultDate) : null,
      sgpa: null,
      cgpa: null,
    });

    const savedSemesterResult =
      await this.semesterResultRepository.save(semesterResult);

    // Create or update grade records for each subject
    for (const subject of dto.subjects) {
      let grade: StudentGrade | null;

      if (subject.gradeId) {
        // Update existing grade
        grade = await this.gradeRepository.findOne({
          where: { id: subject.gradeId },
        });
        if (!grade) {
          throw new NotFoundException(
            `Grade with ID ${subject.gradeId} not found`,
          );
        }
      } else {
        // Create new grade
        grade = this.gradeRepository.create({
          studentId: dto.studentId,
          courseOfferingId: subject.courseOfferingId,
        });
      }

      // Update grade fields
      grade.internalMarks = subject.internalMarks;
      grade.externalMarks = subject.externalMarks;
      grade.marksObtained = subject.totalMarks;
      grade.maxMarks = subject.maxMarks;
      grade.gradeLetter = subject.grade;
      grade.gradePoints = subject.gradePoints;
      grade.semesterResultId = savedSemesterResult.id;

      await this.gradeRepository.save(grade);
    }

    // Calculate SGPA for this semester
    await this.calculateSGPA(savedSemesterResult.id);

    // Recalculate CGPA for the student
    await this.recalculateCGPA(dto.studentId);

    return this.getSemesterResult(savedSemesterResult.id);
  }

  // Get all semester results for a student
  async getSemesterResults(studentId: number) {
    const results = await this.semesterResultRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });

    // Get grades for each semester result
    const resultsWithGrades = await Promise.all(
      results.map(async (result) => {
        const grades = await this.gradeRepository.find({
          where: { semesterResultId: result.id },
        });

        const subjects = await Promise.all(
          grades.map(async (grade) => {
            const offering = await this.courseOfferingRepository.findOne({
              where: { id: grade.courseOfferingId },
              relations: ['course'],
            });

            return {
              id: grade.id,
              subjectCode: offering?.course?.code || 'N/A',
              subjectName: offering?.course?.title || 'Unknown Course',
              credits: offering?.course?.credits || 3,
              internalMarks: grade.internalMarks || 0,
              externalMarks: grade.externalMarks || 0,
              totalMarks: grade.marksObtained || 0,
              maxMarks: grade.maxMarks || 100,
              grade: grade.gradeLetter || 'N/A',
              gradePoints: grade.gradePoints || 0,
              status: grade.gradePoints && grade.gradePoints >= 4 ? 'pass' : 'fail',
            };
          }),
        );

        return {
          id: result.id,
          semester: result.semester,
          session: result.session,
          totalCredits: result.totalCredits,
          earnedCredits: result.earnedCredits,
          sgpa: result.sgpa,
          cgpa: result.cgpa,
          subjects,
          resultDate: result.resultDate
            ? result.resultDate.toISOString().split('T')[0]
            : null,
        };
      }),
    );

    return resultsWithGrades;
  }

  // Get single semester result
  async getSemesterResult(id: number) {
    const result = await this.semesterResultRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Semester result not found');
    }

    const grades = await this.gradeRepository.find({
      where: { semesterResultId: result.id },
    });

    const subjects = await Promise.all(
      grades.map(async (grade) => {
        const offering = await this.courseOfferingRepository.findOne({
          where: { id: grade.courseOfferingId },
          relations: ['course'],
        });

        return {
          id: grade.id,
          subjectCode: offering?.course?.code || 'N/A',
          subjectName: offering?.course?.title || 'Unknown Course',
          credits: offering?.course?.credits || 3,
          internalMarks: grade.internalMarks || 0,
          externalMarks: grade.externalMarks || 0,
          totalMarks: grade.marksObtained || 0,
          maxMarks: grade.maxMarks || 100,
          grade: grade.gradeLetter || 'N/A',
          gradePoints: grade.gradePoints || 0,
          status: grade.gradePoints && grade.gradePoints >= 4 ? 'pass' : 'fail',
        };
      }),
    );

    return {
      id: result.id,
      semester: result.semester,
      session: result.session,
      totalCredits: result.totalCredits,
      earnedCredits: result.earnedCredits,
      sgpa: result.sgpa,
      cgpa: result.cgpa,
      subjects,
      resultDate: result.resultDate
        ? result.resultDate.toISOString().split('T')[0]
        : null,
    };
  }

  // Update semester result
  async updateSemesterResult(id: number, dto: UpdateSemesterResultDto) {
    const result = await this.semesterResultRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Semester result not found');
    }

    Object.assign(result, dto);

    if (dto.resultDate) {
      result.resultDate = new Date(dto.resultDate);
    }

    await this.semesterResultRepository.save(result);

    return this.getSemesterResult(id);
  }

  // Calculate SGPA for a semester
  async calculateSGPA(semesterResultId: number) {
    const semesterResult = await this.semesterResultRepository.findOne({
      where: { id: semesterResultId },
    });

    if (!semesterResult) {
      throw new NotFoundException('Semester result not found');
    }

    const grades = await this.gradeRepository.find({
      where: { semesterResultId },
    });

    if (grades.length === 0) {
      semesterResult.sgpa = null;
      await this.semesterResultRepository.save(semesterResult);
      return;
    }

    // Get course offerings to find credits
    const gradesWithOfferings = await Promise.all(
      grades.map(async (grade) => {
        const offering = await this.courseOfferingRepository.findOne({
          where: { id: grade.courseOfferingId },
          relations: ['course'],
        });
        return { grade, credits: offering?.course?.credits || 3 };
      }),
    );

    let totalPoints = 0;
    let totalCredits = 0;

    for (const { grade, credits } of gradesWithOfferings) {
      if (grade.gradePoints !== null) {
        totalPoints += grade.gradePoints * credits;
        totalCredits += credits;
      }
    }

    const sgpa =
      totalCredits > 0
        ? Math.round((totalPoints / totalCredits) * 100) / 100
        : null;

    semesterResult.sgpa = sgpa;
    await this.semesterResultRepository.save(semesterResult);

    return sgpa;
  }

  // Recalculate CGPA across all semesters
  async recalculateCGPA(studentId: number) {
    const semesterResults = await this.semesterResultRepository.find({
      where: { studentId },
      order: { createdAt: 'ASC' },
    });

    if (semesterResults.length === 0) {
      return null;
    }

    // Calculate cumulative CGPA
    let cumulativeTotalPoints = 0;
    let cumulativeTotalCredits = 0;

    for (const semesterResult of semesterResults) {
      const grades = await this.gradeRepository.find({
        where: { semesterResultId: semesterResult.id },
      });

      const gradesWithOfferings = await Promise.all(
        grades.map(async (grade) => {
          const offering = await this.courseOfferingRepository.findOne({
            where: { id: grade.courseOfferingId },
            relations: ['course'],
          });
          return { grade, credits: offering?.course?.credits || 3 };
        }),
      );

      for (const { grade, credits } of gradesWithOfferings) {
        if (grade.gradePoints !== null) {
          cumulativeTotalPoints += grade.gradePoints * credits;
          cumulativeTotalCredits += credits;
        }
      }

      // Update CGPA for this semester (cumulative up to this point)
      const cgpa =
        cumulativeTotalCredits > 0
          ? Math.round((cumulativeTotalPoints / cumulativeTotalCredits) * 100) /
            100
          : null;

      semesterResult.cgpa = cgpa;
      await this.semesterResultRepository.save(semesterResult);
    }

    return cumulativeTotalCredits > 0
      ? Math.round((cumulativeTotalPoints / cumulativeTotalCredits) * 100) / 100
      : null;
  }

  // Get CGPA history
  async getCGPAHistory(studentId: number) {
    const semesterResults = await this.semesterResultRepository.find({
      where: { studentId },
      order: { createdAt: 'ASC' },
    });

    return semesterResults.map((result) => ({
      semester: result.semester,
      session: result.session,
      sgpa: result.sgpa,
      cgpa: result.cgpa,
    }));
  }
}
