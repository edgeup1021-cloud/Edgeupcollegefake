import { IsString, IsOptional, IsBoolean, IsInt, MaxLength } from 'class-validator';

export class UpdateSubjectDto {
  @IsInt()
  @IsOptional()
  courseId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
