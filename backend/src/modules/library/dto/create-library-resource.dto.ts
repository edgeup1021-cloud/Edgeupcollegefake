import {
  IsString,
  IsOptional,
  IsEnum,
  IsUrl,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { LibraryResourceCategory } from '../../../common/enums/status.enum';

export { LibraryResourceCategory };

export class CreateLibraryResourceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  author?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  type?: string;

  @IsEnum(LibraryResourceCategory)
  category: LibraryResourceCategory;

  @IsString()
  @IsUrl()
  fileUrl: string;

  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  fileSize?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  fileType?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  thumbnailUrl?: string;

  @IsNumber()
  @IsOptional()
  pages?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  duration?: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  subject?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  tags?: string;
}
