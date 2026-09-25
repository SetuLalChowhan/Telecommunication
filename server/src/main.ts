import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'node:path';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { StructuredLogger } from './common/logger/structured-logger.service.js';
import { setupSwagger } from './common/config/swagger.config.js';
import { parseTrustedOrigins } from './config/env.schema.js';

async function bootstrap() {
  const logger = new StructuredLogger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Required by the Better Auth Nest adapter, which registers its own body
    // parser so it can validate raw payloads/HMAC signatures. Do not flip this
    // to `true` without first verifying Better Auth still receives raw bodies.
    bodyParser: false,
    logger,
  });

  const config = app.get(ConfigService);
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  // Trust exactly the configured number of reverse proxies so rate limiting
  // and audit logs see the real client IP. Left unset when directly exposed.
  const trustProxy = config.get<number>('TRUST_PROXY');
  if (trustProxy !== undefined) {
    app.set('trust proxy', trustProxy);
  }

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );

  // CORS — normalize origins and refuse unsafe production configuration.
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

  // Static files (legacy uploads). New uploads are served through authenticated
  // endpoints; this only keeps older locally-stored assets reachable.
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe, interceptors and filters
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

  // Swagger Documentation & Lifecycle hooks
  setupSwagger(app);
  app.enableShutdownHooks();

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port} | Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
