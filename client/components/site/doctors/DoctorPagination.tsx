"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/types/doctor";

interface DoctorPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const DoctorPagination: React.FC<DoctorPaginationProps> = ({
  meta,
  onPageChange,
}) => {
  const { page, totalPages, hasNextPage, hasPrevPage, total } = meta;

  if (totalPages <= 1) return null;

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Total records counter */}
      <p className="text-xs text-secondary-text">
        Showing page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span> ({total} total doctors)
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/80 bg-card text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-all"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Number buttons */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex items-center justify-center h-9 w-8 text-xs text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === page;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`inline-flex items-center justify-center h-9 w-9 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-xs font-bold"
                  : "border border-border/80 bg-card text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/80 bg-card text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-all"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DoctorPagination;
