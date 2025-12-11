import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { SubjectsService } from '../subjects/subjects.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('curriculum/courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly subjectsService: SubjectsService,
  ) {}

  @Public()
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Public()
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.coursesService.remove(id);
  }

  // Get subjects for a specific course
  @Public()
  @Get(':courseId/subjects')
  findSubjectsByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.subjectsService.findSubjectsByCourse(courseId);
  }
}
