import { IsBoolean } from 'class-validator';

export class MarkSolutionDto {
  @IsBoolean()
  isSolution: boolean;
}
