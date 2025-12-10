import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getSuperadminDatabaseConfig } from '../config/superadmin.database.config';

@Global()
@Module({
  imports: [
    // Superadmin database connection (edgeup_super_admin)
    TypeOrmModule.forRootAsync({
      name: 'superadmin',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getSuperadminDatabaseConfig,
    }),
  ],
  exports: [TypeOrmModule],
})
export class SuperadminDatabaseModule {}
