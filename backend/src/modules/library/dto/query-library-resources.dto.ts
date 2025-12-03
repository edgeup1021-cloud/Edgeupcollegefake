import { IsOptional, IsEnum, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { LibraryResourceCategory } from './create-library-resource.dto';

export class QueryLibraryResourcesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  uploadedBy?: number;

  @IsOptional()
  @IsEnum(LibraryResourceCategory)
  category?: LibraryResourceCategory;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['title', 'date', 'views', 'downloads'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}
