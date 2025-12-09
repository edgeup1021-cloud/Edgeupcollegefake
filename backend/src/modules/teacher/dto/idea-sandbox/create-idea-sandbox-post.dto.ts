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
  IdeaSandboxPostType,
  IdeaSandboxCategory,
} from '../../../../common/enums/status.enum';

export class CreateIdeaSandboxPostDto {
  @IsEnum(IdeaSandboxPostType)
  type: IdeaSandboxPostType;

  @IsString()
  @MinLength(10)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(50)
  description: string;

  @IsEnum(IdeaSandboxCategory)
  category: IdeaSandboxCategory;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsOptional()
  tags?: string[];
}
