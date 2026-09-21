import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { AppException } from '../errors/app.exception.js';
import { ErrorCode } from '../errors/error-codes.js';
import { mapPrismaError } from '../errors/prisma-error.mapper.js';
import { REQUEST_ID_HEADER } from '../middleware/request-id.middleware.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request?.headers?.[REQUEST_ID_HEADER] as string) ||
      (request as any)?.requestId ||
      'unknown-request';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ErrorCode.INTERNAL_ERROR;
    let message = 'Internal server error';
    let details: unknown = null;

    // 1. AppException (First-class application domain exception)
    if (exception instanceof AppException) {
      status = exception.getStatus();
      code = exception.code;
      message = exception.message;
      details = exception.details;
    }

    // 2. Standard NestJS HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, any>;
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message || exception.message;

        // Class-validator error formatting
        if (Array.isArray(body.message)) {
          code = ErrorCode.VALIDATION_FAILED;
          details = body.message;
        } else {
          code = body.code || this.defaultCodeForStatus(status);
          details = body.details ?? null;
        }
      }
    }

    // 3. Prisma Known Request Error
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = mapPrismaError(exception);
      status = mapped.getStatus();
      code = mapped.code;
      message = mapped.message;
      details = mapped.details;
    }

    // 4. Fallback unknown error
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = ErrorCode.INTERNAL_ERROR;
      message = 'Internal server error';
      details = null;
    }

    // Structured server-side logging with correlation request ID
    this.logger.error({
      requestId,
      status,
      code,
      method: request.method,
      path: request.url,
      message,
      error: exception instanceof Error ? exception.stack : exception,
    });

    // Uniform RFC error envelope
    response.status(status).json({
      success: false,
      statusCode: status,
      code,
      message,
      details,
      requestId,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private defaultCodeForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }
}