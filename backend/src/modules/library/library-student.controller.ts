import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { LibraryStudentService } from './services/library-student.service';
import { QueryLibraryResourcesDto } from './dto';

@Controller('library/student')
export class LibraryStudentController {
  constructor(private readonly libraryStudentService: LibraryStudentService) {}

  @Get('resources')
  @Public()
  getResources(@Query() query: QueryLibraryResourcesDto) {
    return this.libraryStudentService.findAll(query);
  }

  @Get('resources/:id')
  @Public()
  getResource(@Param('id', ParseIntPipe) id: number) {
    return this.libraryStudentService.findOne(id);
  }

  @Get('categories')
  @Public()
  getCategories() {
    return this.libraryStudentService.getCategories();
  }

  @Get(':studentId/statistics')
  @Public()
  getStatistics(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.libraryStudentService.getStatistics(studentId);
  }

  @Get(':studentId/bookmarks')
  @Public()
  getBookmarks(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.libraryStudentService.getBookmarks(studentId);
  }

  @Post(':studentId/bookmarks/:resourceId')
  @Public()
  addBookmark(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('resourceId', ParseIntPipe) resourceId: number,
  ) {
    return this.libraryStudentService.addBookmark(studentId, resourceId);
  }

  @Delete(':studentId/bookmarks/:resourceId')
  @Public()
  removeBookmark(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('resourceId', ParseIntPipe) resourceId: number,
  ) {
    return this.libraryStudentService.removeBookmark(studentId, resourceId);
  }

  @Get(':studentId/downloads')
  @Public()
  getDownloads(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.libraryStudentService.getDownloads(studentId);
  }

  @Post(':studentId/downloads/:resourceId')
  @Public()
  recordDownload(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('resourceId', ParseIntPipe) resourceId: number,
  ) {
    return this.libraryStudentService.recordDownload(studentId, resourceId);
  }

  @Get(':studentId/recent')
  @Public()
  getRecentlyAccessed(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.libraryStudentService.getRecentlyAccessed(studentId);
  }

  @Post(':studentId/access/:resourceId')
  @Public()
  recordAccess(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('resourceId', ParseIntPipe) resourceId: number,
  ) {
    return this.libraryStudentService.recordAccess(studentId, resourceId);
  }
}
