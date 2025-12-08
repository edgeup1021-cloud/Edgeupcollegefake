import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.database'),
  entities: [
    __dirname + '/../database/entities/management/*.entity{.ts,.js}',
    __dirname + '/../database/entities/student/*.entity{.ts,.js}',
    __dirname + '/../database/entities/teacher/*.entity{.ts,.js}',
  ],
  synchronize: false, // Disabled - use manual SQL for schema changes
  logging: false, // Set to true or ['error', 'warn'] to enable query logging
});
