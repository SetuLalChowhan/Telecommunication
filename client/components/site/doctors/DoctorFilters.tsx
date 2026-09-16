"use client";

import React from "react";
import { Specialty } from "@/types/doctor";
import { Filter, X, RotateCcw, Check, Sparkles } from "lucide-react";

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
  onResetFilters: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

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
  onResetFilters,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const filterContent = (
    <div className="space-y-6">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Filter Doctors</h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Specialty Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Medical Specialties
        </label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSpecialtyChange("")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedSpecialty === ""
                ? "bg-primary text-white shadow-xs"
                : "bg-muted/40 hover:bg-muted text-foreground"
            }`}
          >
            <span>All Specialties</span>
            {selectedSpecialty === "" && <Check className="h-3.5 w-3.5" />}
          </button>
          {specialties.map((spec) => (
            <button
              key={spec.id}
              type="button"
              onClick={() => onSpecialtyChange(spec.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedSpecialty === spec.slug
                  ? "bg-primary text-white shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-foreground"
              }`}
            >
              <span>{spec.name}</span>
              {selectedSpecialty === spec.slug && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Fee Range */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Consultation Fee (৳)
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <span className="text-[10px] text-secondary-text mb-1 block">Min Fee</span>
            <input
              type="number"
              placeholder="0"
              value={minFee}
              onChange={(e) => onMinFeeChange(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-all"
            />
          </div>
          <div>
            <span className="text-[10px] text-secondary-text mb-1 block">Max Fee</span>
            <input
              type="number"
              placeholder="2000"
              value={maxFee}
              onChange={(e) => onMaxFeeChange(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Experience Years */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
          Experience Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Any", val: "" },
            { label: "5+ Years", val: "5" },
            { label: "10+ Years", val: "10" },
            { label: "12+ Years", val: "12" },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => onExperienceChange(item.val)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                experience === item.val
                  ? "bg-primary text-white shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Telehealth Banner */}
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Verified Healthcare</span>
        </div>
        <p className="text-[11px] text-secondary-text leading-relaxed">
          All doctors undergo rigorous license verification before offering virtual appointments.
        </p>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-6 shadow-xs">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filters Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs h-full bg-card p-6 overflow-y-auto shadow-2xl z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Filters</h3>
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="rounded-full p-1 text-secondary-text hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <button
                type="button"
                onClick={onMobileClose}
                className="w-full h-11 rounded-full bg-primary text-white text-sm font-semibold shadow-xs cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorFilters;
