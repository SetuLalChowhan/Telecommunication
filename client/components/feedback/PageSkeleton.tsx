import React from 'react';

interface PageSkeletonProps {
  cards?: number;
  className?: string;
}

export function PageSkeleton({ cards = 3, className = '' }: PageSkeletonProps) {
  return (
    <div className={`space-y-6 animate-pulse p-4 md:p-6 ${className}`} role="status" aria-busy="true">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded-md" />
        <div className="h-4 w-72 bg-muted/60 rounded-md" />
      </div>

      {/* Filter/Action bar skeleton */}
      <div className="h-10 w-full bg-muted/40 rounded-lg" />

      {/* Content cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="h-48 rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted/70 rounded" />
              </div>
            </div>
            <div className="h-16 w-full bg-muted/40 rounded mt-4" />
            <div className="h-8 w-full bg-muted/60 rounded mt-2" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
