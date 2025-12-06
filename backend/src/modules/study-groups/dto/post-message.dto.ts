import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { StudyGroupMessageType } from '../../../database/entities/study-groups/study-group-message.entity';

export class PostStudyGroupMessageDto {
  @IsOptional()
  @IsEnum(StudyGroupMessageType)
  messageType?: StudyGroupMessageType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
