import { IsNumber, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum RegenerateType {
  MACRO = 'macro',
  SESSION = 'session',
  TOOLKIT = 'toolkit',
  SECTION = 'section',
}

export class RegenerateDto {
  @IsEnum(RegenerateType)
  type: RegenerateType;

  @IsNumber()
  targetId: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsBoolean()
  preserveOverrides?: boolean;
}
