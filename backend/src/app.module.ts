/**
 * app.module.ts - Root Application Module
 *
 * This is the main module that orchestrates all other modules in the application.
 * It configures:
 * - Environment variables via ConfigModule
 * - Database connection via TypeOrmModule
 * - Feature modules (StudentModule)
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from './student/student.module';
import { Student } from './student/student.entity';

@Module({
  imports: [
    // ConfigModule loads environment variables from .env file
    // isGlobal: true makes ConfigService available everywhere without re-importing
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeOrmModule configures the database connection
    // Using MySQL with the credentials from environment variables
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'edgeup_college',
      entities: [Student],
      synchronize: false, // Using existing database schema
      logging: true,     // Log SQL queries for debugging
    }),

    // Feature modules
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
