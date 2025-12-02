import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('management/departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @Public()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(id);
  }
}
