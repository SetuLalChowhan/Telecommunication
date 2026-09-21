'use client';

import React from 'react';
import { ApiError } from '@/lib/http/api-error';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: ApiError;
  onRetry?: () => void;
  retrying?: boolean;
}

function titleFor(error: ApiError): string {
  if (error.status === 404) return 'Not Found';
  if (error.status === 403) return 'Access Denied';
  if (error.status === 401) return 'Session Expired';
  if (error.kind === 'network' || error.kind === 'timeout') return 'Connection Problem';
  return 'Something went wrong';
}

export function ErrorState({ error, onRetry, retrying }: ErrorStateProps) {
  const canRetry = !!onRetry && error.status !== 403 && error.status !== 404;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center gap-3 p-8 text-center rounded-xl border border-destructive/20 bg-destructive/5 my-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{titleFor(error)}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{error.message}</p>

      {canRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={retrying}
          className="mt-2 inline-flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Retrying…' : 'Try again'}
        </Button>
      )}

      {error.requestId && (
        <span className="text-xs text-muted-foreground/70 mt-1 font-mono">
          Ref ID: {error.requestId}
        </span>
      )}
    </div>
  );
}
