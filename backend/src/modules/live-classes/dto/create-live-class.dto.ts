import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLiveClassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  subject: string;

  @IsUrl()
  @IsNotEmpty()
  meetLink: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string;

  @IsString()
  @IsNotEmpty()
  scheduledTime: string; // Format: HH:MM:SS or HH:MM

  @IsInt()
  @Min(1)
  duration: number; // Duration in minutes

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  program: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  batch: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  section: string;
}
