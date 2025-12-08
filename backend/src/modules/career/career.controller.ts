import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CareerService, ResumeScoreResult } from './career.service';
import { ScoreResumeByUrlDto, ScoreResumeByTextDto } from './dto';
import { SaveResumeDto } from './dto/save-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync, readFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'uploads', 'resumes');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

@Controller('career')
@UseGuards(JwtAuthGuard)
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post('resume/score-by-url')
  async scoreResumeByUrl(@Body() dto: ScoreResumeByUrlDto): Promise<ResumeScoreResult> {
    return this.careerService.scoreResumeByUrl(dto.resumeUrl, dto.jobDescription);
  }

  @Post('resume/score-by-text')
  async scoreResumeByText(@Body() dto: ScoreResumeByTextDto): Promise<ResumeScoreResult> {
    return this.careerService.scoreResumeByText(dto.resumeText, dto.jobDescription);
  }

  @Post('resume/score-by-file')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: uploadsDir,
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `resume-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Only PDF, DOC, and DOCX files are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async scoreResumeByFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription?: string,
  ): Promise<ResumeScoreResult> {
    if (!file) {
      throw new BadRequestException('Resume file is required');
    }

    try {
      // Extract text from the uploaded file
      const resumeText = await this.extractTextFromFile(file.path, file.originalname);

      // Score the resume using the extracted text
      const result = await this.careerService.scoreResumeByText(resumeText, jobDescription);

      // Clean up the uploaded file
      try {
        unlinkSync(file.path);
      } catch {
        // Ignore cleanup errors
      }

      return result;
    } catch (error) {
      // Clean up on error
      try {
        unlinkSync(file.path);
      } catch {
        // Ignore cleanup errors
      }
      throw new BadRequestException(`Failed to process resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extractTextFromFile(filePath: string, originalName: string): Promise<string> {
    const ext = extname(originalName).toLowerCase();

    if (ext === '.pdf') {
      const dataBuffer = readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    }

    if (ext === '.doc' || ext === '.docx') {
      // For DOC/DOCX, we'll use a simplified approach
      // In production, you'd use a library like mammoth or docx
      const dataBuffer = readFileSync(filePath);
      // Try to extract plain text (works for simple docs)
      const text = dataBuffer.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      return text;
    }

    throw new BadRequestException('Unsupported file format');
  }

  // ===== RESUME STORAGE ENDPOINTS =====

  @Post('resume')
  async saveResume(@Request() req: any, @Body() dto: SaveResumeDto) {
    const studentId = req.user.id;
    const resume = await this.careerService.saveResume(studentId, dto);
    return { success: true, data: resume };
  }

  @Put('resume')
  async updateResume(@Request() req: any, @Body() dto: UpdateResumeDto) {
    const studentId = req.user.id;
    const resume = await this.careerService.saveResume(studentId, dto as SaveResumeDto);
    return { success: true, data: resume };
  }

  @Get('resume')
  async getResume(@Request() req: any) {
    const studentId = req.user.id;
    const resume = await this.careerService.getResume(studentId);
    return { success: true, data: resume };
  }

  @Post('resume/submit')
  async submitResume(@Request() req: any) {
    const studentId = req.user.id;
    const resume = await this.careerService.submitResume(studentId);
    return { success: true, data: resume, message: 'Resume submitted successfully' };
  }

  @Post('resume/analyze')
  async analyzeStoredResume(@Request() req: any, @Body() body: { jobDescription?: string }): Promise<any> {
    const studentId = req.user.id;
    const analysis = await this.careerService.analyzeStoredResume(studentId, body.jobDescription);
    return analysis;
  }
}
