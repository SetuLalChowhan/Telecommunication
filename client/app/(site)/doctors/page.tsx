"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_DOCTORS, MOCK_SPECIALTIES } from "@/constants/mockDoctors";
import { DoctorProfile } from "@/types/doctor";
import { DoctorCard } from "@/components/site/doctors/DoctorCard";
import { DoctorFilters } from "@/components/site/doctors/DoctorFilters";
import { DoctorSearchHeader } from "@/components/site/doctors/DoctorSearchHeader";
import { DoctorPagination } from "@/components/site/doctors/DoctorPagination";
import { Stethoscope, RotateCcw } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const DoctorsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read query params from URL
  const initialSpecialty = searchParams.get("specialty") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialSortBy = (searchParams.get("sortBy") as "rating" | "fee" | "experience") || "rating";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [experience, setExperience] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "fee" | "experience">(initialSortBy);
  const [page, setPage] = useState(initialPage);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pure frontend filtering logic
  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      // Search filter (name or bio)
      if (search.trim()) {
        const query = search.toLowerCase();
        const nameMatch = (doc.user.name || `${doc.user.firstName} ${doc.user.lastName}`)
          .toLowerCase()
          .includes(query);
        const bioMatch = doc.bio?.toLowerCase().includes(query);
        const specMatch = doc.specialties.some((s) =>
          s.specialty.name.toLowerCase().includes(query)
        );
        if (!nameMatch && !bioMatch && !specMatch) return false;
      }

      // Specialty filter
      if (selectedSpecialty) {
        const hasSpec = doc.specialties.some(
          (s) => s.specialty.slug.toLowerCase() === selectedSpecialty.toLowerCase()
        );
        if (!hasSpec) return false;
      }

      // Fee range
      if (minFee && !isNaN(Number(minFee)) && doc.fee < Number(minFee)) {
        return false;
      }
      if (maxFee && !isNaN(Number(maxFee)) && doc.fee > Number(maxFee)) {
        return false;
      }

      // Experience filter
      if (experience && !isNaN(Number(experience)) && (doc.experienceYears || 0) < Number(experience)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "fee") {
        return a.fee - b.fee;
      }
      if (sortBy === "experience") {
        return (b.experienceYears || 0) - (a.experienceYears || 0);
      }
      // default: highest rating
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [search, selectedSpecialty, minFee, maxFee, experience, sortBy]);

  // Pagination calculation
  const total = filteredDoctors.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const meta = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    total,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedSpecialty("");
    setMinFee("");
    setMaxFee("");
    setExperience("");
    setSortBy("rating");
    setPage(1);
  };

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Top Search & Controls Header */}
      <DoctorSearchHeader
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        totalResults={total}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
      />

      {/* Main Content Layout */}
      <div className="max-w-[1920px] mx-auto section-padding-x py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* Filters Sidebar */}
          <DoctorFilters
            specialties={MOCK_SPECIALTIES}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={(slug) => {
              setSelectedSpecialty(slug);
              setPage(1);
            }}
            minFee={minFee}
            onMinFeeChange={(val) => {
              setMinFee(val);
              setPage(1);
            }}
            maxFee={maxFee}
            onMaxFeeChange={(val) => {
              setMaxFee(val);
              setPage(1);
            }}
            experience={experience}
            onExperienceChange={(val) => {
              setExperience(val);
              setPage(1);
            }}
            onResetFilters={handleResetFilters}
            isMobileOpen={isMobileFiltersOpen}
            onMobileClose={() => setIsMobileFiltersOpen(false)}
          />

          {/* Doctor Cards Grid & Pagination Area */}
          <div className="flex-1 w-full min-w-0">
            {paginatedDoctors.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <DoctorPagination
                  meta={meta}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            ) : (
              /* Empty State When No Doctors Match */
              <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center rounded-3xl border border-border/80 bg-card p-8 space-y-4 shadow-xs">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-xl font-bold text-foreground">
                    No Doctors Found
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    We couldn't find any certified doctors matching your current filter criteria. Try adjusting or resetting your search filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs"
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

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-sm font-semibold text-primary">
            <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Loading Doctors Directory...</span>
          </div>
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}
