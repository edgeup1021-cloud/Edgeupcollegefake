import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ManagementModule } from './modules/management/management.module';

@Module({
  imports: [
    // Core modules
    ConfigModule,
    DatabaseModule,
    SharedModule,

    // Feature modules
    AuthModule,
    StudentModule,
    TeacherModule,
    ManagementModule,
  ],
})
export class AppModule {}
