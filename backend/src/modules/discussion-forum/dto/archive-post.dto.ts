import { IsBoolean } from 'class-validator';

export class ArchivePostDto {
  @IsBoolean()
  archived: boolean;
}
