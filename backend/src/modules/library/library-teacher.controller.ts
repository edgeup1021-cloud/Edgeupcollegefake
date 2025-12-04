import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { LibraryTeacherService } from './services/library-teacher.service';
import {
  CreateLibraryResourceDto,
  UpdateLibraryResourceDto,
  QueryLibraryResourcesDto,
} from './dto';

@Controller('library/teacher')
export class LibraryTeacherController {
  constructor(private readonly libraryTeacherService: LibraryTeacherService) {}

  @Post('upload')
  @Public()
  uploadResource(
    @Body() dto: CreateLibraryResourceDto,
    @Query('teacherId') teacherId?: string,
  ) {
    // TODO: Get teacherId from @CurrentUser when auth is fully implemented
    const id = teacherId ? parseInt(teacherId, 10) : 1;
    return this.libraryTeacherService.create(dto, id);
  }

  @Get('resources')
  @Public()
  getResources(@Query() query: QueryLibraryResourcesDto) {
    return this.libraryTeacherService.findAll(query);
  }

  @Get('resources/:id')
  @Public()
  getResource(@Param('id', ParseIntPipe) id: number) {
    return this.libraryTeacherService.findOne(id);
  }

  @Patch('resources/:id')
  @Public()
  updateResource(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibraryResourceDto,
    @Query('teacherId') teacherId?: string,
  ) {
    // TODO: Get teacherId from @CurrentUser when auth is fully implemented
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.libraryTeacherService.update(id, dto, tid);
  }

  @Delete('resources/:id')
  @Public()
  deleteResource(
    @Param('id', ParseIntPipe) id: number,
    @Query('teacherId') teacherId?: string,
  ) {
    // TODO: Get teacherId from @CurrentUser when auth is fully implemented
    const tid = teacherId ? parseInt(teacherId, 10) : 1;
    return this.libraryTeacherService.remove(id, tid);
  }
}
