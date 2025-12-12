import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class UpdateResourceDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  teacherRating?: number;

  @IsOptional()
  @IsString()
  teacherNotes?: string;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}

export class GenerateResourcesDto {
  @IsOptional()
  @IsBoolean()
  includeVideos?: boolean;

  @IsOptional()
  @IsBoolean()
  includeArticles?: boolean;

  @IsOptional()
  @IsBoolean()
  includePDFs?: boolean;

  @IsOptional()
  @IsBoolean()
  includeInteractive?: boolean;
}
