export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Hard ceiling for `limit`, shared by the request parser and the response meta. */
export const MAX_PAGE_SIZE = 100;

export function getPaginationParams(page: number = 1, limit: number = 10) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(limit) || 10));

  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const safePage = Math.max(1, Number(page) || 1);
  // Clamp exactly like `getPaginationParams`, otherwise `meta.limit` reports a
  // page size the query never used and `totalPages` comes out wrong.
  const safeLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(limit) || 10));
  const totalPages = Math.ceil(total / safeLimit) || 1;

  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}
