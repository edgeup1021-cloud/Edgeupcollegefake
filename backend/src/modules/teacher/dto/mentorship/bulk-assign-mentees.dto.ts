import { IsArray, IsInt, ArrayMinSize, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkAssignMenteesDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  studentIds: number[];

  @IsString()
  @IsOptional()
  notes?: string;
}
