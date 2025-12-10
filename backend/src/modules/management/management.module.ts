import { Module } from '@nestjs/common';
import { CampusModule } from './campus/campus.module';
import { DepartmentModule } from './department/department.module';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { DatabaseModule } from '../../database/database.module';
import { SuperadminDatabaseModule } from '../../database/superadmin-database.module';

@Module({
  imports: [
    CampusModule,
    DepartmentModule,
    DatabaseModule,
    SuperadminDatabaseModule,
  ],
  controllers: [ManagementController],
  providers: [ManagementService],
  exports: [CampusModule, DepartmentModule, ManagementService],
})
export class ManagementModule {}
