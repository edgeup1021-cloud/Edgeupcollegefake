import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { GenerateQuestionsDto } from '../dto/question-generator';

@Injectable()
export class QuestionGeneratorService {
  private readonly logger = new Logger(QuestionGeneratorService.name);
  private readonly aiServiceUrl: string;
  private readonly timeout: number = 30000; // 30 seconds

  constructor(private configService: ConfigService) {
    this.aiServiceUrl =
      this.configService.get<string>('aiService.url') ||
      'http://localhost:8005';
    this.logger.log(`AI Service URL configured: ${this.aiServiceUrl}`);
  }

  /**
   * Generate questions using AI service
   */
  async generateQuestions(dto: GenerateQuestionsDto): Promise<any> {
    this.logger.log(
      `Generating ${dto.num_questions || 3} ${dto.question_type || 'mcq'} questions for subject: ${dto.subject}, topic: ${dto.topic}`,
    );

    try {
      // Build AI service request payload
      const aiPayload = {
        subject: dto.subject,
        topic: dto.topic,
        subtopic: dto.subtopic || null,
        num_questions: dto.num_questions || 3,
        question_type: dto.question_type || 'mcq',
        descriptive_type: dto.descriptive_type || null,
        university: dto.university || null,
        course: dto.course || null,
        department: dto.department || null,
        semester: dto.semester || null,
        paper_type: dto.paper_type || null,
        instructions: dto.instructions || null,
        use_validation: true,
        save_to_db: true,
      };

      const startTime = Date.now();
      const result = await this.callAiService(aiPayload);
      const generationTime = Date.now() - startTime;

      this.logger.log(
        `Successfully generated ${result.questions?.length || 0} questions in ${generationTime}ms`,
      );

      return {
        success: result.success || true,
        questions: result.questions || [],
        validation: result.validation || null,
        metadata: {
          ...result.metadata,
          generation_time_ms: generationTime,
        },
      };
    } catch (error) {
      this.logger.error(
        `Question generation failed: ${error.message}`,
        error.stack,
      );
      throw this.handleAiServiceError(error);
    }
  }

  /**
   * Get subjects for a course from AI service
   */
  async getSubjects(course: string): Promise<string[]> {
    this.logger.log(`Fetching subjects for course: ${course}`);

    try {
      const response = await axios.get(
        `${this.aiServiceUrl}/api/college/subjects`,
        {
          params: { course },
          timeout: this.timeout,
        },
      );

      return response.data || [];
    } catch (error) {
      this.logger.error(`Error fetching subjects: ${error.message}`);
      return [];
    }
  }

  /**
   * Get topics for a subject from AI service
   */
  async getTopics(course: string, subject: string): Promise<string[]> {
    this.logger.log(`Fetching topics for course: ${course}, subject: ${subject}`);

    try {
      const response = await axios.get(
        `${this.aiServiceUrl}/api/college/topics`,
        {
          params: { course, subject },
          timeout: this.timeout,
        },
      );

      return response.data || [];
    } catch (error) {
      this.logger.error(`Error fetching topics: ${error.message}`);
      return [];
    }
  }

  /**
   * Get subtopics for a topic from AI service
   */
  async getSubtopics(
    course: string,
    subject: string,
    topic: string,
  ): Promise<string[]> {
    this.logger.log(
      `Fetching subtopics for course: ${course}, subject: ${subject}, topic: ${topic}`,
    );

    try {
      const response = await axios.get(
        `${this.aiServiceUrl}/api/college/subtopics`,
        {
          params: { course, subject, topic },
          timeout: this.timeout,
        },
      );

      return response.data || [];
    } catch (error) {
      this.logger.error(`Error fetching subtopics: ${error.message}`);
      return [];
    }
  }

  /**
   * Get departments for a course from AI service
   */
  async getDepartments(course: string): Promise<string[]> {
    this.logger.log(`Fetching departments for course: ${course}`);

    try {
      const response = await axios.get(
        `${this.aiServiceUrl}/api/college/departments`,
        {
          params: { course },
          timeout: this.timeout,
        },
      );

      return response.data || [];
    } catch (error) {
      this.logger.error(`Error fetching departments: ${error.message}`);
      return [];
    }
  }

  /**
   * Call AI service with retry logic
   */
  private async callAiService(payload: any): Promise<any> {
    try {
      this.logger.debug(
        `Calling AI service: POST ${this.aiServiceUrl}/api/college/generate`,
      );

      const response = await axios.post(
        `${this.aiServiceUrl}/api/college/generate`,
        payload,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data) {
        throw new Error('AI service returned empty response');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle AI service errors and map to HTTP exceptions
   */
  private handleAiServiceError(error: any): HttpException {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Connection refused - service is down
      if (axiosError.code === 'ECONNREFUSED') {
        return new HttpException(
          'AI question generator service is currently unavailable. Please try again later.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // Timeout
      if (
        axiosError.code === 'ETIMEDOUT' ||
        axiosError.code === 'ECONNABORTED' ||
        axiosError.message.includes('timeout')
      ) {
        return new HttpException(
          'AI service request timed out. Please try again with fewer questions or a simpler topic.',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }

      // HTTP error response from AI service
      if (axiosError.response) {
        const status = axiosError.response.status;
        const message =
          (axiosError.response.data as any)?.error ||
          (axiosError.response.data as any)?.message ||
          'AI service error';

        return new HttpException(message, status);
      }

      // Network error
      if (axiosError.code === 'ENETUNREACH' || axiosError.code === 'ENOTFOUND') {
        return new HttpException(
          'Unable to reach AI service. Please check your network connection.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }

    // Unknown error
    return new HttpException(
      'An unexpected error occurred while generating questions. Please try again.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
