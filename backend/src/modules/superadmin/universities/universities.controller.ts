import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto, UpdateUniversityDto } from './dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUniversityDto: CreateUniversityDto) {
    return this.universitiesService.create(createUniversityDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.universitiesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.universitiesService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ) {
    return this.universitiesService.update(id, updateUniversityDto);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.universitiesService.remove(id);
  }

  @Public()
  @Post(':id/assign-head/:headId')
  @HttpCode(HttpStatus.OK)
  assignInstitutionalHead(
    @Param('id', ParseIntPipe) universityId: number,
    @Param('headId', ParseIntPipe) institutionalHeadId: number,
  ) {
    return this.universitiesService.assignInstitutionalHead(
      universityId,
      institutionalHeadId,
    );
  }

  @Public()
  @Delete(':id/assign-head/:headId')
  @HttpCode(HttpStatus.OK)
  unassignInstitutionalHead(
    @Param('id', ParseIntPipe) universityId: number,
    @Param('headId', ParseIntPipe) institutionalHeadId: number,
  ) {
    return this.universitiesService.unassignInstitutionalHead(
      universityId,
      institutionalHeadId,
    );
  }
}
