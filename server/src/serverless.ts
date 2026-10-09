import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Request, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';
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
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'https://telecommunication-sy4h.vercel.app',
    'https://telecommunication-beta.vercel.app',
  ];
  const allowedOrigins = Array.from(
    new Set([...configuredOrigins, ...defaultOrigins]),
  );

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!requestOrigin) {
        return callback(null, true);
      }
      if (
        allowedOrigins.includes(requestOrigin) ||
        requestOrigin.endsWith('.vercel.app') ||
        requestOrigin.startsWith('http://localhost:') ||
        requestOrigin.startsWith('https://localhost:')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow to avoid CORS block on production
    },
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-request-id',
      'set-auth-token',
      'Cookie',
      'Accept',
    ],
    exposedHeaders: ['set-auth-token'],
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
  try {
    if (!isInitialized) {
      await bootstrap();
      isInitialized = true;
    }
    server(req, res);
  } catch (error: any) {
    console.error('Serverless bootstrap error:', error);
    const isProd = process.env.NODE_ENV === 'production';
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-request-id, set-auth-token, Cookie, Accept',
    );
    res.status(500).json({
      success: false,
      message: error?.message || 'Internal Server Error during serverless initialization',
      error: isProd ? undefined : error?.stack,
    });
  }
}
