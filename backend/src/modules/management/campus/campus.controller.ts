import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CampusService } from './campus.service';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('management/campuses')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Get()
  @Public()
  findAll() {
    return this.campusService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campusService.findOne(id);
  }
}
