"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DoctorSortOption = "latest" | "rating" | "fee" | "experience";

interface DoctorSearchHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  sortBy: DoctorSortOption;
  onSortChange: (val: DoctorSortOption) => void;
  totalResults: number;
  onOpenMobileFilters: () => void;
  isSearching?: boolean;
}

export const DoctorSearchHeader: React.FC<DoctorSearchHeaderProps> = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults,
  onOpenMobileFilters,
  isSearching = false,
}) => {
  return (
    <div className="w-full bg-slate-50/60 dark:bg-slate-900/20 border-b border-border py-10 sm:py-14">
      <div className="max-w-[1920px] mx-auto section-padding-x space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 sm:space-y-5 max-w-2xl">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
              Online Medical Consultations
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Consult with Verified Doctors Online
            </h1>
            <p className="text-sm sm:text-[15px] text-secondary-text leading-relaxed">
              Connect with top certified doctors across specialties for private, secure video consultations from anywhere.
            </p>
          </div>

          {/* Results counter */}
          <div className="hidden sm:block text-right">
            <span className="text-xs text-secondary-text block mb-1">Available Doctors</span>
            <span className="text-2xl font-bold text-foreground flex items-center justify-end gap-2">
              {isSearching ? (
                <span className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block" />
              ) : (
                <>
                  {totalResults} <span className="text-xs font-medium text-secondary-text">specialists</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Main Search Input (Debounced) */}
          <div className="relative flex-1">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <input
              type="text"
              placeholder="Search by doctor name, medical specialty, or symptom..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-11 pr-10 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Select & Mobile Filter Actions */}
          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="w-52 sm:w-56">
              <Select
                value={sortBy}
                onValueChange={(val) =>
                  onSortChange(val as DoctorSortOption)
                }
              >
                <SelectTrigger className="h-11 rounded-xl border-border bg-card px-4 text-sm font-medium shadow-xs hover:border-primary/40 focus:ring-primary/20">
                  <div className="flex items-center gap-2 truncate">
                    <ArrowUpDown className="h-3.5 w-3.5 text-primary shrink-0" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl border-border bg-card shadow-lg">
                  <SelectItem value="latest" className="text-sm font-medium">
                    Latest Doctors
                  </SelectItem>
                  <SelectItem value="rating" className="text-sm font-medium">
                    Top Rated
                  </SelectItem>
                  <SelectItem value="fee" className="text-sm font-medium">
                    Fee: Low to High
                  </SelectItem>
                  <SelectItem value="experience" className="text-sm font-medium">
                    Most Experienced
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="lg:hidden flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground shadow-xs hover:border-primary/40 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSearchHeader;
