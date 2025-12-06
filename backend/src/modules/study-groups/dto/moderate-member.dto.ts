import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ModerateMemberAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  KICK = 'kick',
}

export class ModerateMemberDto {
  @IsEnum(ModerateMemberAction)
  action: ModerateMemberAction;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
