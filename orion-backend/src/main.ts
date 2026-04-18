import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ── Préfixe global de l'API ─────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── CORS ─────────────────────────────────────────────────
  const corsOrigins = configService
    .get<string>('CORS_ORIGIN', 'http://localhost:5173,http://localhost:8081')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // ── Validation globale (class-validator) ─────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Rejette les propriétés inconnues
      transform: true,            // Transforme les payloads en instances DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Filtre global d'exceptions ───────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── Intercepteur de réponse uniforme ─────────────────────
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Swagger / OpenAPI ────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ORION API - Signalement JOJ 2026')
    .setDescription(
      'API REST de gestion des incidents signalés par les citoyens '
      + 'lors des Jeux Olympiques de la Jeunesse 2026 au Sénégal. '
      + 'Permet la création de signalements, le suivi des incidents '
      + 'et l\'exposition des données au dashboard de supervision.',
    )
    .setVersion('1.0.0')
    .addTag('Incidents', 'Gestion des signalements d\'incidents')
    .addTag('Agents', 'Gestion des agents ORION')
    .setContact('Équipe ORION', 'https://orion.sn', 'dev@orion.sn')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ORION API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // ── Démarrage ────────────────────────────────────────────
  const port = configService.get<number>('APP_PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 ORION Backend démarré sur http://localhost:${port}`);
  logger.log(`📚 Documentation Swagger : http://localhost:${port}/api/docs`);
  logger.log(`🔗 API Base URL : http://localhost:${port}/api/v1`);
}

bootstrap();
