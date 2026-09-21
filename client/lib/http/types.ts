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
