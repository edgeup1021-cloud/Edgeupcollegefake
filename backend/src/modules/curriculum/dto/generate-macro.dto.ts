import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCurriculumCourseDto } from './create-curriculum-course.dto';

export class GenerateMacroDto {
  @IsOptional()
  @IsNumber()
  courseId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCurriculumCourseDto)
  courseData?: CreateCurriculumCourseDto;
}
