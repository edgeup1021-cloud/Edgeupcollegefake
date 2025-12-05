import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';

@Module({
  imports: [ConfigModule],
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
})
export class CareerModule {}
