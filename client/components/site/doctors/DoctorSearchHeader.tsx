"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

interface DoctorSearchHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  sortBy: "rating" | "fee" | "experience";
  onSortChange: (val: "rating" | "fee" | "experience") => void;
  totalResults: number;
  onOpenMobileFilters: () => void;
}

export const DoctorSearchHeader: React.FC<DoctorSearchHeaderProps> = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults,
  onOpenMobileFilters,
}) => {
  return (
    <div className="w-full bg-slate-50/70 dark:bg-slate-900/30 border-b border-border/70 py-10 sm:py-14">
      <div className="max-w-[1920px] mx-auto section-padding-x space-y-6">
        {/* Title & Subtitle */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <span>Verified Medical Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            Find the Best <span className="text-primary">Doctor</span> for You
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
            Connect instantly with top certified doctors across Bangladesh for instant video consultation or clinic appointments.
          </p>
        </div>

        {/* Search Bar & Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or condition..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-border/80 bg-card pl-11 pr-10 py-3 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort & Mobile Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="relative flex-1 sm:flex-initial">
              <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-3 text-xs sm:text-sm font-semibold text-foreground shadow-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                <select
                  aria-label="Sort doctors by"
                  value={sortBy}
                  onChange={(e) =>
                    onSortChange(e.target.value as "rating" | "fee" | "experience")
                  }
                  className="bg-transparent border-none outline-none cursor-pointer text-xs sm:text-sm font-semibold text-foreground pr-2"
                >
                  <option value="rating">Top Rated</option>
                  <option value="fee">Lowest Fee</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="lg:hidden flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-3 text-xs sm:text-sm font-semibold text-foreground shadow-xs hover:border-primary/40 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Results Counter Summary */}
        <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
          <p>
            Showing <span className="font-semibold text-foreground">{totalResults}</span> certified doctors available
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorSearchHeader;
