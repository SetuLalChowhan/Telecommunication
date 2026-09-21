export interface ErrorContext {
  componentStack?: string;
  queryKey?: unknown;
  url?: string;
  [key: string]: unknown;
}

export function reportError(error: unknown, context?: ErrorContext): void {
  // Production observability stub (ready for Sentry.captureException)
  if (process.env.NODE_ENV === 'development') {
    // Only log in development; never spam console in production
    // eslint-disable-next-line no-console
    console.error('[Observability] Error reported:', error, context);
  }
}
