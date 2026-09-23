"use client";

import React from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  entityName?: string;
  className?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  entityName = "consultations",
  className,
}) => {
  if (total === 0) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card/60",
        className
      )}
    >
      {/* Information Counter */}
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{startRecord}</span>–
        <span className="font-semibold text-foreground">{endRecord}</span> of{" "}
        <span className="font-semibold text-primary">{total}</span> {entityName}
      </p>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav aria-label={`${entityName} pagination`}>
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <span className="flex items-center gap-1">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            }
            previousLabel={
              <span className="flex items-center gap-1">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </span>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            forcePage={page - 1}
            renderOnZeroPageCount={null}
            containerClassName="flex items-center gap-1 list-none m-0 p-0 select-none"
            pageClassName="inline-block"
            pageLinkClassName="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
            activeClassName="!border-primary"
            activeLinkClassName="!bg-primary !border-primary !text-white !font-bold shadow-xs"
            previousClassName="inline-block"
            previousLinkClassName="inline-flex items-center justify-center h-8 px-2.5 rounded-md border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
            nextClassName="inline-block"
            nextLinkClassName="inline-flex items-center justify-center h-8 px-2.5 rounded-md border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
            breakClassName="inline-block"
            breakLinkClassName="inline-flex items-center justify-center w-7 h-8 text-xs text-muted-foreground"
            disabledClassName="opacity-40 pointer-events-none cursor-not-allowed"
          />
        </nav>
      )}
    </div>
  );
};

export default TablePagination;
