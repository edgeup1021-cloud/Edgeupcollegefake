import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  StudyGroup,
  StudyGroupMember,
  StudyGroupMessage,
  StudyGroupTeacherModerator,
} from '../../database/entities/study-groups';
import { StudentUser } from '../../database/entities/student';
import { TeacherCourseOffering, TeacherUser } from '../../database/entities/teacher';
import { StudyGroupsService } from './study-groups.service';
import { StudentStudyGroupsController } from './student-study-groups.controller';
import { TeacherStudyGroupsController } from './teacher-study-groups.controller';
import { StudyGroupsGateway } from './study-groups.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyGroup,
      StudyGroupMember,
      StudyGroupMessage,
      StudyGroupTeacherModerator,
      StudentUser,
      TeacherUser,
      TeacherCourseOffering,
    ]),
  ],
  providers: [StudyGroupsService, StudyGroupsGateway],
  controllers: [StudentStudyGroupsController, TeacherStudyGroupsController],
  exports: [StudyGroupsService],
})
export class StudyGroupsModule {}
