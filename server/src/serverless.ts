import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { StructuredLogger } from './common/logger/structured-logger.service.js';
import { setupSwagger } from './common/config/swagger.config.js';
import { parseTrustedOrigins } from './config/env.schema.js';

const server = express();
let isInitialized = false;

async function bootstrap() {
  const logger = new StructuredLogger('Bootstrap');
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    {
      bodyParser: false,
      logger,
    },
  );

  const config = app.get(ConfigService);
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  const trustProxy = config.get<number>('TRUST_PROXY');
  if (trustProxy !== undefined) {
    server.set('trust proxy', trustProxy);
  }

  server.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );

  const configuredOrigins = parseTrustedOrigins(
    config.get<string>('TRUSTED_ORIGINS'),
  );
  const allowedOrigins =
    configuredOrigins.length > 0
      ? configuredOrigins
      : ['http://localhost:3000', 'http://localhost:5173'];

  if (allowedOrigins.includes('*')) {
    throw new Error(
      'TRUSTED_ORIGINS must not contain "*" while credentialed CORS is enabled.',
    );
  }

  if (isProduction) {
    const insecure = allowedOrigins.filter(
      (origin) => !origin.startsWith('https://'),
    );
    if (insecure.length > 0) {
      throw new Error(
        `Refusing to start: non-https trusted origins in production: ${insecure.join(', ')}`,
      );
    }
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  await app.init();
}

export default async function handler(req: Request, res: Response) {
  if (!isInitialized) {
    await bootstrap();
    isInitialized = true;
  }
  server(req, res);
}
