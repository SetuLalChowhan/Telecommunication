import { ApiError } from '../http/api-error';

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) {
    return false;
  }
  return error instanceof ApiError && error.isRetryable;
}

/**
 * Exponential backoff with random jitter.
 * TanStack Query v5 attempt is 0-indexed.
 */
export function retryDelay(attempt: number): number {
  const baseDelay = Math.min(1000 * 2 ** attempt, 30_000);
  const jitter = 0.5 + Math.random() / 2;
  return Math.round(baseDelay * jitter);
}
