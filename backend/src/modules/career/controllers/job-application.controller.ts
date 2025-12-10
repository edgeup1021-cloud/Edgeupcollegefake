import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { JobApplicationService } from '../services/job-application.service';
import { CreateJobApplicationDto } from '../dto/job-application/create-job-application.dto';
import { UpdateJobApplicationDto } from '../dto/job-application/update-job-application.dto';
import { UpdateApplicationStatusDto } from '../dto/job-application/update-application-status.dto';

@Controller('career/applications')
@UseGuards(JwtAuthGuard)
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  /**
   * GET /api/career/applications
   * Get all job applications for the authenticated student
   */
  @Get()
  async findAll(@Request() req: any) {
    const studentId = req.user.id;
    return this.jobApplicationService.findAllByStudent(studentId);
  }

  /**
   * GET /api/career/applications/stats
   * Get application statistics for the authenticated student
   */
  @Get('stats')
  async getStats(@Request() req: any) {
    const studentId = req.user.id;
    return this.jobApplicationService.getStats(studentId);
  }

  /**
   * GET /api/career/applications/:id
   * Get a single job application by ID
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const studentId = req.user.id;
    return this.jobApplicationService.findOne(id, studentId);
  }

  /**
   * POST /api/career/applications
   * Create a new job application
   */
  @Post()
  async create(
    @Body() createDto: CreateJobApplicationDto,
    @Request() req: any,
  ) {
    const studentId = req.user.id;
    return this.jobApplicationService.create(studentId, createDto);
  }

  /**
   * PUT /api/career/applications/:id
   * Update a job application (full update)
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateJobApplicationDto,
    @Request() req: any,
  ) {
    const studentId = req.user.id;
    return this.jobApplicationService.update(id, studentId, updateDto);
  }

  /**
   * PATCH /api/career/applications/:id/status
   * Update only the status of an application (for drag-and-drop)
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateApplicationStatusDto,
    @Request() req: any,
  ) {
    const studentId = req.user.id;
    return this.jobApplicationService.updateStatus(id, studentId, statusDto.status);
  }

  /**
   * DELETE /api/career/applications/:id
   * Delete a job application
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const studentId = req.user.id;
    await this.jobApplicationService.remove(id, studentId);
    return { message: 'Application deleted successfully' };
  }
}
