import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { StudentResume } from '../../database/entities/student/student-resume.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([StudentResume]),
  ],
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
})
export class CareerModule {}
