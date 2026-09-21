import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppException } from './app.exception.js';
import { ErrorCode } from './error-codes.js';

export function mapPrismaError(error: Prisma.PrismaClientKnownRequestError): AppException {
  switch (error.code) {
    case 'P2025':
      return new AppException(
        ErrorCode.NOT_FOUND,
        'The requested record was not found.',
        HttpStatus.NOT_FOUND,
        error.meta,
      );

    case 'P2002': {
      const target = (error.meta?.target as string[]) || [];
      const fieldList = target.join(', ');
      return new AppException(
        ErrorCode.CONFLICT,
        fieldList
          ? `A record with this ${fieldList} already exists.`
          : 'A duplicate record already exists.',
        HttpStatus.CONFLICT,
        error.meta,
      );
    }

    case 'P2003':
      return new AppException(
        ErrorCode.BAD_REQUEST,
        'Invalid relation or reference to another record.',
        HttpStatus.BAD_REQUEST,
        error.meta,
      );

    default:
      return new AppException(
        ErrorCode.INTERNAL_ERROR,
        'A database error occurred.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
  }
}
