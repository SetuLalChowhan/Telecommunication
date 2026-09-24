"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDoctors, useSpecialties } from "@/features/doctors";
import { DoctorProfile } from "@/features/doctors/types";
import { DoctorCard } from "@/components/site/doctors/DoctorCard";
import { DoctorCardSkeleton } from "@/components/site/doctors/DoctorCardSkeleton";
import { DoctorFilters } from "@/components/site/doctors/DoctorFilters";
import { DoctorSearchHeader, DoctorSortOption } from "@/components/site/doctors/DoctorSearchHeader";
import { DoctorPagination } from "@/components/site/doctors/DoctorPagination";
import { Stethoscope, RotateCcw } from "lucide-react";

const ITEMS_PER_PAGE = 6;

export const DoctorList: React.FC = () => {
  const searchParams = useSearchParams();

  // Read initial query params from URL
  const initialSpecialty =
    searchParams.get("specialty") || searchParams.get("specialtySlug") || "";
  // Match the server prefetch: the hero search links with `?q=`, older links use `search`.
  const initialSearch = (searchParams.get("q") || searchParams.get("search") || "").trim();
  // Every filter below must mirror the server prefetch exactly. If the initial
  // client state builds a different query key than the one that was prefetched,
  // React Query treats it as a cache miss and throws the hydrated data away.
  const initialMinFee = searchParams.get("minFee") || "";
  const initialMaxFee = searchParams.get("maxFee") || "";
  const initialExperience =
    searchParams.get("experience") || searchParams.get("minExperience") || "";
  const initialSortBy =
    (searchParams.get("sortBy") as DoctorSortOption) || "latest";
  const initialPage = Number(searchParams.get("page")) || 1;

  // Staged / Draft filter inputs
  const [draftSearch, setDraftSearch] = useState(initialSearch);
  const [draftSpecialty, setDraftSpecialty] = useState(initialSpecialty);
  const [draftMinFee, setDraftMinFee] = useState(initialMinFee);
  const [draftMaxFee, setDraftMaxFee] = useState(initialMaxFee);
  const [draftExperience, setDraftExperience] = useState(initialExperience);

  // Applied filter state (triggers the actual query fetch)
  const [appliedFilters, setAppliedFilters] = useState({
    search: initialSearch,
    specialty: initialSpecialty,
    minFee: initialMinFee,
    maxFee: initialMaxFee,
    experience: initialExperience,
  });

  const [sortBy, setSortBy] = useState<DoctorSortOption>(initialSortBy);
  const [page, setPage] = useState(initialPage);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Debounced search effect (350ms). Skips the initial mount so a deep link
  // (e.g. `?q=cardio&page=3`) keeps the page/param it was prefetched with
  // instead of resetting to page 1 and refetching.
  useEffect(() => {
    if (draftSearch.trim() === appliedFilters.search) return;

    const handler = setTimeout(() => {
      setAppliedFilters((prev) => ({ ...prev, search: draftSearch.trim() }));
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [draftSearch, appliedFilters.search]);

  // Fetch real specialties from backend API
  const { data: specialties = [] } = useSpecialties();

  // TanStack Query (hydrates instantly from Server Prefetch, and executes queries when applied)
  const { data: apiResponse, isLoading, isFetching } = useDoctors({
    search: appliedFilters.search.trim() || undefined,
    specialtySlug: appliedFilters.specialty || undefined,
    minFee:
      appliedFilters.minFee && !isNaN(Number(appliedFilters.minFee))
        ? Number(appliedFilters.minFee)
        : undefined,
    maxFee:
      appliedFilters.maxFee && !isNaN(Number(appliedFilters.maxFee))
        ? Number(appliedFilters.maxFee)
        : undefined,
    experience: appliedFilters.experience || undefined,
    sortBy,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const doctorsList: DoctorProfile[] = apiResponse?.data || [];
  const totalResults = apiResponse?.meta?.total ?? doctorsList.length;

  const meta = apiResponse?.meta || {
    page,
    limit: ITEMS_PER_PAGE,
    total: totalResults,
    totalPages: Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE)),
    hasNextPage: false,
    hasPreviousPage: false,
  };

  // Apply filters from sidebar / mobile
  const handleApplyFilters = () => {
    setAppliedFilters({
      search: draftSearch.trim(),
      specialty: draftSpecialty,
      minFee: draftMinFee,
      maxFee: draftMaxFee,
      experience: draftExperience,
    });
    setPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setDraftSearch("");
    setDraftSpecialty("");
    setDraftMinFee("");
    setDraftMaxFee("");
    setDraftExperience("");
    setAppliedFilters({
      search: "",
      specialty: "",
      minFee: "",
      maxFee: "",
      experience: "",
    });
    setSortBy("latest");
    setPage(1);
  };

  // Skeletons only when there is genuinely no data yet (first visit / first load).
  // Refetches for filters, search and pagination keep the previous results visible
  // (see `placeholderData` in useDoctors) so the page never flashes between states.
  const showSkeleton = isLoading;

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Top Search & Controls Header */}
      <DoctorSearchHeader
        search={draftSearch}
        onSearchChange={(val) => setDraftSearch(val)}
        sortBy={sortBy}
        onSortChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        totalResults={totalResults}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        isSearching={isFetching}
      />

      {/* Main Content Layout */}
      <div className="container-page py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Filters Sidebar */}
          <DoctorFilters
            specialties={specialties}
            selectedSpecialty={draftSpecialty}
            onSpecialtyChange={(slug) => setDraftSpecialty(slug)}
            minFee={draftMinFee}
            onMinFeeChange={(val) => setDraftMinFee(val)}
            maxFee={draftMaxFee}
            onMaxFeeChange={(val) => setDraftMaxFee(val)}
            experience={draftExperience}
            onExperienceChange={(val) => setDraftExperience(val)}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            isApplying={isFetching}
            isMobileOpen={isMobileFiltersOpen}
            onMobileClose={() => setIsMobileFiltersOpen(false)}
          />

          {/* Doctor Cards Grid & Pagination Area */}
          <div className="flex-1 w-full min-w-0">
            {showSkeleton ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <DoctorCardSkeleton key={i} />
                ))}
              </div>
            ) : doctorsList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {doctorsList.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>

                <DoctorPagination
                  meta={meta}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            ) : (
              <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center rounded-xl border border-border bg-card p-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-base font-semibold text-foreground">
                    No doctors found
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    We couldn&apos;t find any certified doctors matching your current
                    filters. Try adjusting or resetting your search.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset all filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
