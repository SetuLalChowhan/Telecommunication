import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { closeAuthDatabase } from '../auth/auth.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static pool: pg.Pool;

  constructor() {
    if (!PrismaService.pool) {
      PrismaService.pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        max: Number(process.env.DB_POOL_MAX || 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // 10s timeout to allow Neon serverless wake-up
      });

      // Handle unexpected errors on idle database connections to prevent pool crashes
      PrismaService.pool.on('error', (err) => {
        new Logger(PrismaService.name).warn(
          `Postgres connection pool idle error (will reconnect): ${err.message}`,
        );
      });
    }

    const adapter = new PrismaPg(PrismaService.pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // Better Auth owns a separate pool/client at module scope; close it too so
    // shutdown never leaks database connections.
    await closeAuthDatabase();
    await PrismaService.pool?.end().catch(() => undefined);
  }
}