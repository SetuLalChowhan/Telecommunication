"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDoctors, useSpecialties } from "@/features/doctors";
import { DoctorProfile } from "@/types/doctor";
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
  const initialSearch = searchParams.get("search") || "";
  const initialSortBy =
    (searchParams.get("sortBy") as DoctorSortOption) || "latest";
  const initialPage = Number(searchParams.get("page")) || 1;

  // Staged / Draft filter inputs
  const [draftSearch, setDraftSearch] = useState(initialSearch);
  const [draftSpecialty, setDraftSpecialty] = useState(initialSpecialty);
  const [draftMinFee, setDraftMinFee] = useState("");
  const [draftMaxFee, setDraftMaxFee] = useState("");
  const [draftExperience, setDraftExperience] = useState("");

  // Applied filter state (triggers the actual query fetch)
  const [appliedFilters, setAppliedFilters] = useState({
    search: initialSearch,
    specialty: initialSpecialty,
    minFee: "",
    maxFee: "",
    experience: "",
  });

  const [sortBy, setSortBy] = useState<DoctorSortOption>(initialSortBy);
  const [page, setPage] = useState(initialPage);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Debounced search effect (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setAppliedFilters((prev) => {
        if (prev.search === draftSearch.trim()) return prev;
        return {
          ...prev,
          search: draftSearch.trim(),
        };
      });
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [draftSearch]);

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
    hasPrevPage: false,
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

  // Show skeleton whenever initial loading OR refetching filters occurs
  const showSkeleton = isLoading || isFetching;

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
      <div className="max-w-[1920px] mx-auto section-padding-x py-10 sm:py-12">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <DoctorCardSkeleton key={i} />
                ))}
              </div>
            ) : doctorsList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center rounded-2xl border border-border bg-card p-8 space-y-4 shadow-xs">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-bold text-foreground">
                    No Doctors Found
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    We couldn&apos;t find any certified doctors matching your current
                    filter criteria. Try adjusting or resetting your search
                    filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset All Filters</span>
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
