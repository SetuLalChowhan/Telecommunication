/**
 * Response shapes shared by every feature API.
 *
 * These mirror the Nest transform interceptor + pagination utils exactly, so a
 * `{ data, meta }` response is decoded in one place instead of per feature.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const EMPTY_PAGINATION_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

/** A decoded paginated response: the rows plus the server pagination meta. */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
