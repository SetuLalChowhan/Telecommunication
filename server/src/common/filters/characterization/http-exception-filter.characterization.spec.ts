import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpExceptionFilter } from '../http-exception.filter.js';
import { HttpException, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('HttpExceptionFilter Characterization', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: any;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockRequest = {
      method: 'POST',
      url: '/appointments',
    };

    mockHost = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };
  });

  it('formats standard HttpException with success: false and statusCode', () => {
    const exception = new NotFoundException('Doctor with id 123 not found');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Doctor with id 123 not found',
        path: '/appointments',
        timestamp: expect.any(String),
      }),
    );
  });

  it('maps Prisma P2025 (record not found) to 404', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'An operation failed because it depends on one or more records that were required but not found.',
      {
        code: 'P2025',
        clientVersion: '7.10.0',
      },
    );

    filter.catch(prismaError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        code: 'NOT_FOUND',
        message: 'The requested record was not found.',
        path: '/appointments',
        requestId: expect.any(String),
      }),
    );
  });

  it('maps Prisma P2002 (unique constraint violation) to 409', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed on the fields: (`slug`)',
      {
        code: 'P2002',
        clientVersion: '7.10.0',
      },
    );

    filter.catch(prismaError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.CONFLICT,
        code: 'CONFLICT',
        message: 'A duplicate record already exists.',
        path: '/appointments',
        requestId: expect.any(String),
      }),
    );
  });

  it('maps Prisma P2003 (foreign key constraint violation) to 400', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Foreign key constraint failed',
      {
        code: 'P2003',
        clientVersion: '7.10.0',
      },
    );

    filter.catch(prismaError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        code: 'BAD_REQUEST',
        message: 'Invalid relation or reference to another record.',
        path: '/appointments',
        requestId: expect.any(String),
      }),
    );
  });

  it('maps unknown unexpected errors to 500 Internal Server Error', () => {
    const unknownError = new Error('Database disconnected abruptly');

    filter.catch(unknownError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }),
    );
  });
});
