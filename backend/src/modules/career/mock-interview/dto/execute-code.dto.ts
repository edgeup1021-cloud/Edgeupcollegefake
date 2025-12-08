import { IsString, IsArray, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TestCaseDto {
  @IsString()
  input: string;

  @IsString()
  output: string;

  @IsString()
  @IsOptional()
  explanation?: string;
}

export class ExecuteCodeRequestDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  functionSignature: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases: TestCaseDto[];
}

export class TestResultDto {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export class CodeOutputDto {
  stdout: string;
  stderr: string;
  returnValue: string | null;
  error: string | null;
  testResults?: TestResultDto[];
}
