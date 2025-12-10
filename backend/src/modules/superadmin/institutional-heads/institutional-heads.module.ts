import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionalHead } from '../../../database/entities/superadmin';
import { InstitutionalHeadsService } from './institutional-heads.service';
import { InstitutionalHeadsController } from './institutional-heads.controller';
import { DatabaseModule } from '../../../database/database.module';
import { SuperadminDatabaseModule } from '../../../database/superadmin-database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstitutionalHead], 'superadmin'),
    DatabaseModule,
    SuperadminDatabaseModule,
  ],
  controllers: [InstitutionalHeadsController],
  providers: [InstitutionalHeadsService],
  exports: [InstitutionalHeadsService],
})
export class InstitutionalHeadsModule {}
