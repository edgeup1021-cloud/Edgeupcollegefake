import {
  IsString,
  IsOptional,
  IsEnum,
  IsUrl,
  IsNumber,
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

  @IsEnum(LibraryResourceCategory)
  category: LibraryResourceCategory;

  @IsString()
  @IsUrl()
  fileUrl: string;

  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  fileType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  subject?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  tags?: string;
}
