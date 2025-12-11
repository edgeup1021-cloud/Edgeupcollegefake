import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { PublicationStatus } from '../../../../database/entities/teacher/teacher-publication.entity';

export class CreatePublicationDto {
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  publicationTitle: string;

  @IsString()
  @MinLength(3, { message: 'Journal/Conference name must be at least 3 characters' })
  @MaxLength(300, { message: 'Journal/Conference name must not exceed 300 characters' })
  journalConferenceName: string;

  @IsDateString()
  publicationDate: string;

  @IsEnum(PublicationStatus, { message: 'Invalid publication status' })
  status: PublicationStatus;

  @IsString()
  @IsOptional()
  coAuthors?: string;

  @IsString()
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsOptional()
  publicationUrl?: string;

  @IsInt({ message: 'Citations count must be an integer' })
  @Min(0, { message: 'Citations count cannot be negative' })
  @IsOptional()
  citationsCount?: number;

  @IsNumber()
  @Min(0, { message: 'Impact factor cannot be negative' })
  @Max(999.99, { message: 'Impact factor must not exceed 999.99' })
  @IsOptional()
  impactFactor?: number;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  doi?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  isbnIssn?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  volumeNumber?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  issueNumber?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  pageNumbers?: string;

  @IsString()
  @MaxLength(500, { message: 'Personal notes must not exceed 500 characters' })
  @IsOptional()
  personalNotes?: string;
}
