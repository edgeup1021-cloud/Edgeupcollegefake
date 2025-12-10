import {
  IsArray,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';

export class AddParticipantsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  studentIds: number[];
}
