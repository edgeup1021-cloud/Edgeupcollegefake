import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ArchiveStudyGroupDto {
  @Type(() => Boolean)
  @IsBoolean()
  archived: boolean;
}
