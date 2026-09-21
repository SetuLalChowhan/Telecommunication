import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodeType } from './error-codes.js';

export class AppException extends HttpException {
  constructor(
    readonly code: ErrorCodeType | string,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    readonly details: unknown = null,
  ) {
    super({ code, message, details }, status);
  }
}
