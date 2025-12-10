import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class UpdateTopicDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  orderIndex?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
