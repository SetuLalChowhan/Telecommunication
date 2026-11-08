import axios from 'axios';

/**
 * The single normalized error type for the whole client.
 *
 * Every failure — browser, server, network, timeout — becomes an `ApiError`,
 * so React Query, error boundaries and toasts all share one contract.
 */

export type ErrorKind = 'http' | 'network' | 'timeout' | 'aborted' | 'unknown';

export interface ApiErrorOptions {
  status?: number | null;
  code?: string;
  kind?: ErrorKind;
  details?: unknown;
  requestId?: string;
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly kind: ErrorKind;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? null;
    this.code = options.code ?? 'UNKNOWN';
    this.kind = options.kind ?? 'http';
    this.details = options.details;
    this.requestId = options.requestId;
  }

  get isRetryable(): boolean {
    if (this.kind === 'network' || this.kind === 'timeout') {
      return true;
    }
    return this.status !== null && [408, 429, 502, 503, 504].includes(this.status);
  }
}

/**
 * True when the request failed because the resource does not exist. Callers
 * use this to turn a 404 into `notFound()` / an empty detail result while still
 * letting every other failure (network, 5xx, auth) propagate.
 */
export function isNotFound(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) {
    return err;
  }

  if (axios.isCancel(err)) {
    return new ApiError('Request cancelled', { kind: 'aborted', code: 'ABORTED' });
  }

  if (axios.isAxiosError(err)) {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return new ApiError('The request timed out. Please try again.', {
        kind: 'timeout',
        code: 'TIMEOUT',
      });
    }

    if (!err.response) {
      const isNetworkAborted = err.code === 'ERR_NETWORK' || err.message === 'Network Error';
      const detailMsg =
        err.message && !isNetworkAborted && err.message !== 'Error'
          ? ` (${err.message})`
          : '';
      return new ApiError(
        `Unable to reach the server. If uploading a file, please ensure it is under 4MB${detailMsg}.`,
        {
          kind: 'network',
          code: err.code || 'NETWORK',
        },
      );
    }

    if (err.response.status === 413) {
      return new ApiError(
        'The uploaded file exceeds the server limit (4MB). Please compress the file before uploading.',
        {
          status: 413,
          code: 'PAYLOAD_TOO_LARGE',
          kind: 'http',
        },
      );
    }

    const data = err.response.data as
      | {
          code?: string;
          message?: string | string[];
          details?: unknown;
          requestId?: string;
        }
      | undefined;

    const headerId = err.response.headers['x-request-id'];
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || err.message || 'Something went wrong.';

    return new ApiError(message, {
      status: err.response.status,
      code: data?.code || `HTTP_${err.response.status}`,
      details: data?.details,
      requestId: data?.requestId || (typeof headerId === 'string' ? headerId : undefined),
    });
  }

  if (err instanceof Error) {
    return new ApiError(err.message, { kind: 'unknown' });
  }

  return new ApiError('Unexpected error occurred.', { kind: 'unknown' });
}
