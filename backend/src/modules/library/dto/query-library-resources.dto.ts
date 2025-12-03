import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
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
}
