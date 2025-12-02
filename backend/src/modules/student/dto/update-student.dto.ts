import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';
import { StudentStatus } from '../../../common/enums/status.enum';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;
}
