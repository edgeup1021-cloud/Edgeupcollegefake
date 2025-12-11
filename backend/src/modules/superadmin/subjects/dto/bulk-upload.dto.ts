import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

/**
 * DTO for a single row in the bulk upload Excel file
 */
export class BulkUploadRowDto {
  @IsNotEmpty()
  @IsString()
  subjectName: string;

  @IsNotEmpty()
  @IsString()
  subjectCode: string;

  @IsOptional()
  @IsString()
  subjectDescription?: string;

  @IsNotEmpty()
  @IsString()
  topicName: string;

  @IsNotEmpty()
  @IsString()
  topicCode: string;

  @IsOptional()
  @IsString()
  topicDescription?: string;

  @IsNotEmpty()
  @IsString()
  subtopicName: string;

  @IsNotEmpty()
  @IsString()
  subtopicCode: string;

  @IsOptional()
  @IsString()
  subtopicDescription?: string;
}

/**
 * Response DTO for bulk upload operation
 */
export interface BulkUploadResponseDto {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
  created: {
    subjects: number;
    topics: number;
    subtopics: number;
  };
}
