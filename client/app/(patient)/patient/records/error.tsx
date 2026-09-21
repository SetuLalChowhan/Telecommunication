'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Route Error]', error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center gap-4 p-10 text-center rounded-xl border border-destructive/20 bg-destructive/5 my-8 mx-4"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset} className="mt-2 inline-flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
      {error.digest && (
        <span className="text-xs text-muted-foreground/60 font-mono">
          Digest: {error.digest}
        </span>
      )}
    </div>
  );
}