import { PartialType } from '@nestjs/mapped-types';
import { CreateIdeaSandboxPostDto } from './create-idea-sandbox-post.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { IdeaSandboxPostStatus } from '../../../../common/enums/status.enum';

export class UpdateIdeaSandboxPostDto extends PartialType(
  CreateIdeaSandboxPostDto,
) {
  @IsEnum(IdeaSandboxPostStatus)
  @IsOptional()
  status?: IdeaSandboxPostStatus;
}
