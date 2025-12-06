import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const socketPath = configService.get<string>('database.socketPath');
  return {
    type: 'mysql',
    host: socketPath ? undefined : configService.get<string>('database.host'),
    port: socketPath ? undefined : configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    extra: socketPath ? { socketPath } : undefined,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Disabled - use manual SQL for schema changes
    logging: false, // Set to true or ['error', 'warn'] to enable query logging
  };
};
