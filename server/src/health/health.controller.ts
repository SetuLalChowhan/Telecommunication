import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { PrismaService } from '../prisma/prisma.service.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

const DB_CHECK_TIMEOUT_MS = 3000;

@ApiTags('Health')
@AllowAnonymous()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liveness: is the process up and able to serve traffic? Does not touch
   * downstream dependencies, so a transient database blip never restarts a
   * healthy instance.
   */
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Process is alive' })
  live() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Readiness: are required dependencies (database) reachable? Returns 503 when
   * the instance cannot serve requests so orchestrators stop routing to it.
   */
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (database + dependencies)' })
  @ApiResponse({ status: 200, description: 'Ready to serve traffic' })
  @ApiResponse({ status: 503, description: 'A required dependency is unavailable' })
  async ready() {
    const start = Date.now();
    const dbStatus = await this.checkDatabase();

    if (dbStatus !== 'up') {
      throw new ServiceUnavailableException('Database is not reachable');
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      info: {
        database: {
          status: dbStatus,
          latencyMs: Date.now() - start,
        },
        memory: {
          heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        },
      },
    };
  }

  /**
   * Backwards-compatible aggregate health endpoint.
   */
  @Get()
  @ApiOperation({ summary: 'System and database health check' })
  async check() {
    const start = Date.now();
    let dbStatus = 'down';
    let dbLatencyMs = -1;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
      dbLatencyMs = Date.now() - start;
    } catch {
      dbStatus = 'down';
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: dbStatus === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      info: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
        memory: {
          heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        },
      },
    };
  }

  private async checkDatabase(): Promise<'up' | 'down'> {
    try {
      await Promise.race([
        this.prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Database health check timed out')),
            DB_CHECK_TIMEOUT_MS,
          ),
        ),
      ]);
      return 'up';
    } catch {
      return 'down';
    }
  }
}
