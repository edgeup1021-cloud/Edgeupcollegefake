import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsArray,
  ArrayMinSize,
  Min,
  Max,
  Matches,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateCourseOfferingDto {
  @IsString()
  @IsNotEmpty()
  subCode: string;

  @IsString()
  @IsNotEmpty()
  subTitle: string;

  @IsString()
  @IsNotEmpty()
  semester: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  batch: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  sessionDays: string[]; // ["Mon", "Wed", "Fri"]

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string; // "09:00"

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string; // "10:00"

  @IsString()
  @IsNotEmpty()
  room: string;

  @IsString()
  @IsIn(['Lecture', 'Lab', 'Tutorial'])
  sessionType: string;

  @IsDateString()
  semesterStartDate: string;

  @IsDateString()
  semesterEndDate: string;
}
