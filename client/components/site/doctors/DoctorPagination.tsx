"use client";

import React from "react";
import ReactPaginate from "react-paginate";
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
  const { page, totalPages, total, limit } = meta;

  if (totalPages <= 1) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  return (
    <div className="mt-10 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Information Counter */}
      <p className="text-xs text-secondary-text">
        Showing <span className="font-bold text-foreground">{startRecord}</span> -{" "}
        <span className="font-bold text-foreground">{endRecord}</span> of{" "}
        <span className="font-bold text-primary">{total}</span> certified doctors
      </p>

      {/* ReactPaginate Component with custom Tailwind classes */}
      <nav aria-label="Doctors pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <span className="flex items-center gap-1">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          }
          previousLabel={
            <span className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Prev</span>
            </span>
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={totalPages}
          forcePage={page - 1}
          renderOnZeroPageCount={null}
          // Container classes
          containerClassName="flex items-center gap-1.5 list-none m-0 p-0 select-none"
          // Page item classes
          pageClassName="inline-block"
          pageLinkClassName="inline-flex items-center justify-center min-w-[36px] h-9 px-2.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          // Active item classes
          activeClassName="!border-primary"
          activeLinkClassName="!bg-primary !border-primary !text-white !font-bold shadow-xs hover:!bg-primary-dark"
          // Previous button classes
          previousClassName="inline-block"
          previousLinkClassName="inline-flex items-center justify-center h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          // Next button classes
          nextClassName="inline-block"
          nextLinkClassName="inline-flex items-center justify-center h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          // Break classes
          breakClassName="inline-block"
          breakLinkClassName="inline-flex items-center justify-center w-8 h-9 text-xs text-muted-foreground"
          // Disabled state classes
          disabledClassName="opacity-40 pointer-events-none cursor-not-allowed"
        />
      </nav>
    </div>
  );
};

export default DoctorPagination;
