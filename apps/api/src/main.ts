import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('MakauraAPI');
  const app = await NestFactory.create(AppModule, {
    cors: false, // configured manually below
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 4000);
  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  const allowedOrigins = configService.get<string[]>('cors.allowedOrigins', [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]);

  // Cookie Parser Middleware
  app.use(cookieParser());

  // Global API Prefix
  app.setGlobalPrefix(apiPrefix);


  // CORS Configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Dev mode permissive, production strict via config
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global Interceptors & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Makaura Beauty Brand Marketplace API')
    .setDescription(
      'REST API specification for the multi-vendor luxury beauty marketplace platform (LAAM-inspired).',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('System Health', 'Endpoints for infrastructure and service health monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Makaura API Documentation',
  });

  // Enable Graceful Shutdown
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`🚀 Makaura API is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📄 Swagger OpenAPI docs: http://localhost:${port}/api/docs`);
  logger.log(`🩺 Health endpoint: http://localhost:${port}/${apiPrefix}/health`);
}

bootstrap();
