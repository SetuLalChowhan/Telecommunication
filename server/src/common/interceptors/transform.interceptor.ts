import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorator/response-message.decorator.js';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_KEY,
        context.getHandler(),
      ) ?? 'Request successful';

    return next.handle().pipe(
      map((resData) => {
        // Automatically detect paginated responses containing data and meta keys
        const isPaginated =
          resData !== null &&
          typeof resData === 'object' &&
          'data' in resData &&
          'meta' in resData;

        if (isPaginated) {
          return {
            success: true,
            statusCode: response.statusCode,
            message,
            data: resData.data,
            meta: resData.meta,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data: resData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}