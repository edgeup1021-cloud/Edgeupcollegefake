import {
  IsEnum,
  IsString,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import {
  DiscussionPostType,
  DiscussionCategory,
} from '../../../common/enums/status.enum';

export class CreateDiscussionPostDto {
  @IsEnum(DiscussionPostType)
  type: DiscussionPostType;

  @IsString()
  @MinLength(10)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(50)
  description: string;

  @IsEnum(DiscussionCategory)
  category: DiscussionCategory;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsOptional()
  tags?: string[];
}
