import {
  IsString,
  IsArray,
  IsOptional,
  MaxLength,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  studentIds: number[];
}
