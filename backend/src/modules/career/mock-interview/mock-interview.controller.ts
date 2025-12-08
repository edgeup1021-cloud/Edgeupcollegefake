import { Controller, Post, Get, Body, Param, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { MockInterviewService } from './mock-interview.service';
import {
  ChatRequestDto,
  ChatResponseDto,
  ExecuteCodeRequestDto,
  CodeOutputDto,
  GenerateReportRequestDto,
} from './dto';
import { InterviewReport } from './entities/interview-report.entity';
import { InterviewSession } from './entities/interview-session.entity';

interface RequestWithUser {
  user: {
    id: number;
  };
}

@Controller('career/mock-interview')
@UseGuards(JwtAuthGuard)
export class MockInterviewController {
  constructor(private readonly mockInterviewService: MockInterviewService) {}

  @Post('chat')
  async chat(@Request() req: RequestWithUser, @Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    const studentId = req.user.id;
    return await this.mockInterviewService.processChat(studentId, dto);
  }

  @Post('execute-code')
  async executeCode(@Body() dto: ExecuteCodeRequestDto): Promise<CodeOutputDto> {
    return await this.mockInterviewService.executeCode(dto);
  }

  @Post('generate-report')
  async generateReport(
    @Request() req: RequestWithUser,
    @Body() dto: GenerateReportRequestDto,
  ): Promise<InterviewReport> {
    const studentId = req.user.id;
    return await this.mockInterviewService.generateReport(studentId, dto);
  }

  @Get('sessions')
  async getSessions(@Request() req: RequestWithUser): Promise<InterviewSession[]> {
    const studentId = req.user.id;
    return await this.mockInterviewService.getSessions(studentId);
  }

  @Get('reports')
  async getReports(@Request() req: RequestWithUser): Promise<InterviewReport[]> {
    const studentId = req.user.id;
    return await this.mockInterviewService.getReports(studentId);
  }

  @Get('reports/:id')
  async getReportById(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InterviewReport> {
    const studentId = req.user.id;
    return await this.mockInterviewService.getReportById(studentId, id);
  }
}
