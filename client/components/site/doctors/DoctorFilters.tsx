"use client";

import React from "react";
import { Specialty } from "@/features/doctors/types";
import { Filter, RotateCcw, ShieldCheck, Stethoscope, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface DoctorFiltersProps {
  specialties: Specialty[];
  selectedSpecialty: string;
  onSpecialtyChange: (slug: string) => void;
  minFee: string;
  onMinFeeChange: (val: string) => void;
  maxFee: string;
  onMaxFeeChange: (val: string) => void;
  experience: string;
  onExperienceChange: (val: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isApplying?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const EXPERIENCE_OPTIONS = [
  { label: "Any", val: "" },
  { label: "5+ years", val: "5" },
  { label: "10+ years", val: "10" },
  { label: "15+ years", val: "15" },
];

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
  minFee,
  onMinFeeChange,
  maxFee,
  onMaxFeeChange,
  experience,
  onExperienceChange,
  onApplyFilters,
  onResetFilters,
  isApplying = false,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const hasActiveFilters = Boolean(selectedSpecialty || minFee || maxFee || experience);

  const feeInputClass =
    "w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-primary/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

  const filterContent = (
    <div className="space-y-6">
      {/* Header & reset */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Specialty */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Stethoscope className="h-3.5 w-3.5 text-primary" />
          <span>Medical specialty</span>
        </label>
        <Select
          value={selectedSpecialty || "all"}
          onValueChange={(val) => onSpecialtyChange(val === "all" ? "" : val)}
        >
          <SelectTrigger className="h-10 rounded-lg border border-border bg-card text-sm font-medium">
            <SelectValue placeholder="All specialties" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border bg-card shadow-lg max-h-64">
            <SelectItem value="all" className="text-sm font-medium">
              All specialties
            </SelectItem>
            {specialties.map((spec) => (
              <SelectItem key={spec.id} value={spec.slug} className="text-sm font-medium">
                <span>{spec.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fee range */}
      <div className="space-y-2 pt-4 border-t border-border/70">
        <label className="block text-xs font-medium text-foreground">Consultation fee (BDT)</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Min (৳)</span>
            <input
              type="number"
              placeholder="0"
              value={minFee}
              onChange={(e) => onMinFeeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onApplyFilters();
              }}
              className={feeInputClass}
            />
          </div>
          <div>
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Max (৳)</span>
            <input
              type="number"
              placeholder="2000"
              value={maxFee}
              onChange={(e) => onMaxFeeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onApplyFilters();
              }}
              className={feeInputClass}
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-2 pt-4 border-t border-border/70">
        <label className="block text-xs font-medium text-foreground">Experience level</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_OPTIONS.map((item) => {
            const isSelected = experience === item.val;
            return (
              <button
                key={item.val}
                type="button"
                onClick={() => onExperienceChange(item.val)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer border ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apply */}
      <div className="pt-4 border-t border-border/70">
        <Button
          type="button"
          disabled={isApplying}
          onClick={onApplyFilters}
          className="w-full h-10 rounded-lg font-semibold text-sm"
        >
          {isApplying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Applying...</span>
            </span>
          ) : (
            <span>Apply filters</span>
          )}
        </Button>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-muted/40 p-3.5 text-xs text-secondary-text">
        <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
        <p className="leading-relaxed">
          All registered doctors are BMDC-certified and verified for online practice.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-80 xl:w-[340px] shrink-0">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
          {filterContent}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          <div className="relative ml-auto z-10 flex h-full w-full max-w-xs flex-col justify-between overflow-y-auto bg-card p-6 shadow-xl">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                <button
                  type="button"
                  onClick={onMobileClose}
                  aria-label="Close filters"
                  className="rounded-lg p-1 text-secondary-text hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <Button
                type="button"
                disabled={isApplying}
                onClick={() => {
                  onApplyFilters();
                  onMobileClose?.();
                }}
                className="w-full h-11 rounded-lg font-semibold text-sm"
              >
                {isApplying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Applying...</span>
                  </span>
                ) : (
                  <span>Apply filters</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorFilters;
