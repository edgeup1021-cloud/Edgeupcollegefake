import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LANGUAGE_CONFIG } from './types/language-config';
import { generateTestHarness, extractFunctionName } from './types/test-harness';
import { ExecuteCodeRequestDto, CodeOutputDto, TestResultDto } from './dto';
import { SupportedLanguage } from './types/coding.types';

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

@Injectable()
export class Judge0Service {
  private readonly logger = new Logger(Judge0Service.name);
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.apiUrl =
      this.configService.get<string>('JUDGE0_API_URL') || 'https://ce.judge0.com';
  }

  private toBase64(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  private fromBase64(str: string | null): string {
    if (!str) return '';
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  async executeCode(dto: ExecuteCodeRequestDto): Promise<CodeOutputDto> {
    const { code, language, functionSignature, testCases } = dto;

    const languageConfig = LANGUAGE_CONFIG[language as SupportedLanguage];
    if (!languageConfig) {
      throw new BadRequestException(`Unsupported language: ${language}`);
    }

    const functionName = extractFunctionName(functionSignature, language as SupportedLanguage);
    const testResults: TestResultDto[] = [];
    let hasError = false;
    let errorMessage = '';

    for (const testCase of testCases) {
      try {
        const executableCode = generateTestHarness(
          language as SupportedLanguage,
          code,
          functionName,
          testCase.input,
        );

        const submission: Judge0Submission = {
          source_code: this.toBase64(executableCode),
          language_id: languageConfig.id,
        };

        const response = await axios.post<Judge0Response>(
          `${this.apiUrl}/submissions?base64_encoded=true&wait=true`,
          submission,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const result = response.data;

        const stdout = this.fromBase64(result.stdout).trim();
        const stderr = this.fromBase64(result.stderr).trim();
        const compileOutput = this.fromBase64(result.compile_output).trim();

        // Check for compilation/runtime errors
        if (result.status.id !== 3) {
          if (result.status.id === 6) {
            hasError = true;
            errorMessage = compileOutput || 'Compilation error';
            break;
          } else if (result.status.id === 11) {
            hasError = true;
            errorMessage = stderr || 'Runtime error';
            break;
          } else if (result.status.id === 5) {
            hasError = true;
            errorMessage = 'Time limit exceeded - possible infinite loop';
            break;
          } else {
            hasError = true;
            errorMessage = result.status.description || stderr || 'Execution error';
            break;
          }
        }

        const actualOutput = stdout;
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        testResults.push({
          input: testCase.input,
          expected: expectedOutput,
          actual: actualOutput,
          passed,
        });
      } catch (error) {
        this.logger.error('Test case execution error:', error);
        hasError = true;
        errorMessage = error instanceof Error ? error.message : 'Execution failed';
        break;
      }
    }

    return {
      stdout: '',
      stderr: '',
      returnValue: null,
      error: hasError ? errorMessage : null,
      testResults: hasError ? [] : testResults,
    };
  }
}
