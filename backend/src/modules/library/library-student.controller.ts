import {
  Controller,
  Get,
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
}
