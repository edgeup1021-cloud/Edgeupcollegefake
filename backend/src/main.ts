/**
 * main.ts - Application Entry Point
 *
 * This is where the NestJS application starts. It bootstraps the app,
 * configures global middleware, and starts listening for HTTP requests.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Initializes and starts the NestJS application
 *
 * The bootstrap process:
 * 1. Creates the NestJS application instance from AppModule
 * 2. Configures global settings (CORS, validation, prefix)
 * 3. Starts the HTTP server on the specified port
 */
async function bootstrap() {
  // Create the NestJS application instance
  // NestFactory reads all module decorators and builds the dependency injection container
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Cross-Origin Resource Sharing)
  // This allows the frontend (localhost:3000) to communicate with the backend (localhost:3001)
  // Without CORS, browsers block requests to different origins for security
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Set global prefix for all routes
  // All endpoints will be prefixed with /api (e.g., /api/student)
  app.setGlobalPrefix('api');

  // Configure global validation pipe
  // This automatically validates incoming request bodies against DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true,           // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow type coercion
      },
    }),
  );

  // Start the server
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API endpoints available at: http://localhost:${port}/api`);
}

bootstrap();
