import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscussionPostDto } from './create-discussion-post.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DiscussionPostStatus } from '../../../common/enums/status.enum';

export class UpdateDiscussionPostDto extends PartialType(
  CreateDiscussionPostDto,
) {
  @IsEnum(DiscussionPostStatus)
  @IsOptional()
  status?: DiscussionPostStatus;
}
