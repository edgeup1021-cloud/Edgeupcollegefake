import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { SuperadminUser } from '../../database/entities/superadmin';
import { SharedModule } from '../../shared/shared.module';
import { CoursesModule } from './courses/courses.module';
import { SubjectsModule } from './subjects/subjects.module';
import { InstitutionalHeadsModule } from './institutional-heads/institutional-heads.module';
import { UniversitiesModule } from './universities/universities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperadminUser], 'superadmin'),
    SharedModule,
    CoursesModule,
    SubjectsModule,
    InstitutionalHeadsModule,
    UniversitiesModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}
