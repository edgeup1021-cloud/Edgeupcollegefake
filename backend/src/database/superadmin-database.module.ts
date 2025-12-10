import { Module, Global } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { getSuperadminDatabaseConfig } from '../config/superadmin.database.config';

const superadminDataSourceProvider = {
  provide: 'SUPERADMIN_DATA_SOURCE',
  useFactory: (dataSource: DataSource) => dataSource,
  inject: [getDataSourceToken('superadmin')],
};

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
  providers: [superadminDataSourceProvider],
  exports: [TypeOrmModule, superadminDataSourceProvider],
})
export class SuperadminDatabaseModule {}
