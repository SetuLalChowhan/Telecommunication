'use client';

import React, { ReactNode } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { toApiError } from '@/lib/api/error';
import { ErrorState } from './ErrorState';
import { PageSkeleton } from './PageSkeleton';
import { EmptyState } from './EmptyState';

export interface QueryBoundaryProps<T> {
  query: Pick<
    UseQueryResult<T>,
    'data' | 'isPending' | 'isError' | 'error' | 'refetch' | 'isRefetching'
  >;
  loading?: ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}

export function QueryBoundary<T>({
  query,
  loading = <PageSkeleton />,
  isEmpty,
  empty = <EmptyState />,
  children,
}: QueryBoundaryProps<T>) {
  // 1. Initial loading state (isPending and no existing data)
  if (query.isPending) {
    return <>{loading}</>;
  }

  // 2. Initial error state (isError and no existing stale data)
  if (query.isError && query.data === undefined) {
    return (
      <ErrorState
        error={toApiError(query.error)}
        onRetry={() => query.refetch()}
        retrying={query.isRefetching}
      />
    );
  }

  const data = query.data as T;

  // 3. Empty data state
  if (isEmpty?.(data)) {
    return <>{empty}</>;
  }

  // 4. Success state (typed non-null data)
  return <>{children(data)}</>;
}
