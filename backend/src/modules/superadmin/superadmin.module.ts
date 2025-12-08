import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { SuperadminUser } from '../../database/entities/superadmin';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperadminUser], 'superadmin'),
    SharedModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}
