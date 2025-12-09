import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewSession } from './entities/interview-session.entity';
import { InterviewReport } from './entities/interview-report.entity';
import { OpenAIService } from './openai.service';
import { Judge0Service } from './judge0.service';
import {
  ChatRequestDto,
  ChatResponseDto,
  ExecuteCodeRequestDto,
  CodeOutputDto,
  GenerateReportRequestDto,
} from './dto';

@Injectable()
export class MockInterviewService {
  private readonly logger = new Logger(MockInterviewService.name);

  constructor(
    @InjectRepository(InterviewSession)
    private readonly sessionRepo: Repository<InterviewSession>,
    @InjectRepository(InterviewReport)
    private readonly reportRepo: Repository<InterviewReport>,
    private readonly openaiService: OpenAIService,
    private readonly judge0Service: Judge0Service,
  ) {}

  async processChat(studentId: number, dto: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      // Get or create active session
      let session = await this.sessionRepo.findOne({
        where: { studentId, status: 'active' },
      });

      if (!session) {
        session = this.sessionRepo.create({
          studentId,
          messages: [],
          status: 'active',
          startedAt: new Date(),
        });
        await this.sessionRepo.save(session);
      }

      // Update messages
      session.messages = dto.messages;
      await this.sessionRepo.save(session);

      // Get AI response
      const response = await this.openaiService.createChatCompletion(
        dto.messages,
        dto.disableTools,
      );

      return response;
    } catch (error) {
      this.logger.error('Chat processing error:', error);
      throw error;
    }
  }

  async executeCode(dto: ExecuteCodeRequestDto): Promise<CodeOutputDto> {
    try {
      return await this.judge0Service.executeCode(dto);
    } catch (error) {
      this.logger.error('Code execution error:', error);
      throw error;
    }
  }

  async generateReport(
    studentId: number,
    dto: GenerateReportRequestDto,
  ): Promise<InterviewReport> {
    try {
      // Get the active session
      const session = await this.sessionRepo.findOne({
        where: { studentId, status: 'active' },
      });

      // Format conversation for analysis
      const conversationText = dto.messages
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n');

      // Generate detailed analysis
      const analysis = await this.openaiService.generateReportAnalysis(
        conversationText,
        dto.language,
      );

      // Calculate duration
      const start = new Date(dto.startTime);
      const end = new Date();
      const durationMs = end.getTime() - start.getTime();
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      const duration = `${minutes}m ${seconds}s`;

      // Calculate overall score
      const overallScore = Math.round(
        (dto.assessment.technicalScore +
          dto.assessment.communicationScore +
          dto.assessment.problemSolvingScore) /
          3,
      );

      // Count challenges
      const challengesAttempted = this.countCodingChallenges(dto.messages);
      const challengesPassed = this.countPassedChallenges(dto.messages);

      // Create report
      const report = this.reportRepo.create({
        studentId,
        sessionId: session?.id || null,
        duration,
        language: dto.language,
        technicalScore: dto.assessment.technicalScore,
        communicationScore: dto.assessment.communicationScore,
        problemSolvingScore: dto.assessment.problemSolvingScore,
        overallScore,
        overallAssessment: dto.assessment.overallAssessment,
        strengths: dto.assessment.strengths,
        areasForImprovement: dto.assessment.areasForImprovement,
        executiveSummary: analysis.executiveSummary || '',
        technicalAnalysis: analysis.technicalAnalysis || '',
        communicationAnalysis: analysis.communicationAnalysis || '',
        codingPerformanceDetails: analysis.codingPerformanceDetails || '',
        challengesAttempted,
        challengesPassed,
        keyHighlights: analysis.keyHighlights || [],
        recommendations: analysis.recommendations || [],
      });

      await this.reportRepo.save(report);

      // Mark session as completed
      if (session) {
        session.status = 'completed';
        session.completedAt = new Date();
        session.challengesAttempted = challengesAttempted;
        session.challengesPassed = challengesPassed;
        await this.sessionRepo.save(session);
      }

      this.logger.log(`Report generated for student ${studentId}`);
      return report;
    } catch (error) {
      this.logger.error('Report generation error:', error);
      throw error;
    }
  }

  async getSessions(studentId: number): Promise<InterviewSession[]> {
    return await this.sessionRepo.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async getReports(studentId: number): Promise<InterviewReport[]> {
    return await this.reportRepo.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async getReportById(studentId: number, reportId: number): Promise<InterviewReport> {
    const report = await this.reportRepo.findOne({
      where: { id: reportId, studentId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  private countCodingChallenges(messages: { role: string; content: string }[]): number {
    return messages.filter(
      (m) => m.role === 'assistant' && m.content.toLowerCase().includes('coding challenge'),
    ).length;
  }

  private countPassedChallenges(messages: { role: string; content: string }[]): number {
    return messages.filter((m) =>
      m.content.includes('[User completed the coding challenge successfully'),
    ).length;
  }
}
