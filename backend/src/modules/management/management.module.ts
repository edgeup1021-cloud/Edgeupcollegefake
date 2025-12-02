import { Module } from '@nestjs/common';
import { CampusModule } from './campus/campus.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [CampusModule, DepartmentModule],
  exports: [CampusModule, DepartmentModule],
})
export class ManagementModule {}
