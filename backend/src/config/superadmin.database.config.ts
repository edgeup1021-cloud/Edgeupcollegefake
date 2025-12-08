import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  SuperadminUser,
  University,
  Program,
  ProgramDepartment,
  ProgramSemester,
  CourseType,
  CourseSubject,
  CourseTopic,
  CourseSubtopic,
} from '../database/entities/superadmin';

export const getSuperadminDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const config = {
    type: 'mysql' as const,
    host: configService.get<string>('SUPERADMIN_DB_HOST', 'localhost'),
    port: configService.get<number>('SUPERADMIN_DB_PORT', 3306),
    username: configService.get<string>('SUPERADMIN_DB_USERNAME', 'root'),
    password: configService.get<string>('SUPERADMIN_DB_PASSWORD', ''),
    database: configService.get<string>('SUPERADMIN_DB_DATABASE', 'edgeup_super_admin'),
    entities: [
      SuperadminUser,
      University,
      Program,
      ProgramDepartment,
      ProgramSemester,
      CourseType,
      CourseSubject,
      CourseTopic,
      CourseSubtopic,
    ],
    synchronize: false,
    logging: true,
  };

  console.log('[Superadmin DB Config] Initializing connection with:', {
    host: config.host,
    port: config.port,
    username: config.username,
    database: config.database,
    password: config.password ? '***' : '(empty)',
  });

  return config;
};
