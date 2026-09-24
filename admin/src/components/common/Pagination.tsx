import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/api/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

/**
 * Pagination driven entirely by the server's `meta`, so the UI can never show
 * page counts that disagree with the backend.
 */
export function Pagination({ meta, onPageChange, isFetching = false }: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-muted-foreground">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
        {isFetching ? " · updating…" : ""}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold cursor-pointer"
          disabled={!meta.hasPreviousPage || isFetching}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold cursor-pointer"
          disabled={!meta.hasNextPage || isFetching}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
