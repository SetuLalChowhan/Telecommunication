/**
 * Canonical API response contracts.
 *
 * Every backend response is wrapped in a single envelope. The HTTP client
 * unwraps it once so feature code never has to inspect `success`/`data`/`meta`.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Largest page size the API accepts. Dashboard lists that filter client-side
 * request this so they do not silently truncate at the default page size.
 */
export const MAX_PAGE_SIZE = 100;

export const EMPTY_PAGINATION_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
