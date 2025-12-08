import { IsOptional, IsString, Length } from 'class-validator';

export class JoinStudyGroupDto {
  @IsOptional()
  @IsString()
  @Length(4, 64)
  inviteCode?: string;
}
