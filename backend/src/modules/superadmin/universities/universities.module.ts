import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from '../../../database/entities/superadmin';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { InstitutionalHeadsModule } from '../institutional-heads/institutional-heads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([University], 'superadmin'),
    InstitutionalHeadsModule,
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
