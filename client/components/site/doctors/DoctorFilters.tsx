"use client";

import React from "react";
import { Specialty } from "@/types/doctor";
import { Filter, RotateCcw, ShieldCheck, Stethoscope } from "lucide-react";
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

  const filterContent = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Filters</h3>
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

      {/* 1. Specialty Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Stethoscope className="h-3.5 w-3.5 text-primary" />
          <span>Medical Specialty</span>
        </label>
        <Select
          value={selectedSpecialty || "all"}
          onValueChange={(val) => onSpecialtyChange(val === "all" ? "" : val)}
        >
          <SelectTrigger
            className={`h-11 rounded-xl text-sm font-medium transition-all ${
              selectedSpecialty
                ? "border-2 border-primary bg-primary/5 text-primary font-semibold ring-2 ring-primary/20 shadow-xs"
                : "border border-border bg-card text-foreground hover:border-primary/40 focus:ring-primary/20"
            }`}
          >
            <SelectValue placeholder="All Specialties" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border bg-card shadow-xl max-h-64">
            <SelectItem value="all" className="text-sm font-medium">
              All Specialties
            </SelectItem>
            {specialties.map((spec) => (
              <SelectItem
                key={spec.id}
                value={spec.slug}
                className="text-sm font-medium flex items-center justify-between"
              >
                <span>{spec.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2. Fee Range */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-xs font-semibold text-foreground block">
          Consultation Fee (BDT)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] text-secondary-text mb-1 block">Min (৳)</span>
            <input
              type="number"
              placeholder="0"
              value={minFee}
              onChange={(e) => onMinFeeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onApplyFilters();
              }}
              className={`w-full h-9 px-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                minFee
                  ? "border-2 border-primary bg-primary/5 font-semibold ring-1 ring-primary/20"
                  : "border border-border bg-card focus:border-primary"
              }`}
            />
          </div>
          <div>
            <span className="text-[11px] text-secondary-text mb-1 block">Max (৳)</span>
            <input
              type="number"
              placeholder="2000"
              value={maxFee}
              onChange={(e) => onMaxFeeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onApplyFilters();
              }}
              className={`w-full h-9 px-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                maxFee
                  ? "border-2 border-primary bg-primary/5 font-semibold ring-1 ring-primary/20"
                  : "border border-border bg-card focus:border-primary"
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3. Experience Level */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-xs font-semibold text-foreground block">
          Experience Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Any Experience", val: "" },
            { label: "5+ Years", val: "5" },
            { label: "10+ Years", val: "10" },
            { label: "15+ Years", val: "15" },
          ].map((item) => {
            const isSelected = experience === item.val;
            return (
              <button
                key={item.val}
                type="button"
                onClick={() => onExperienceChange(item.val)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
                  isSelected
                    ? "border-2 border-primary bg-primary text-white shadow-xs font-bold ring-2 ring-primary/20"
                    : "bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground border border-border"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apply Filters Action Button */}
      <div className="pt-2 border-t border-border space-y-2">
        <Button
          type="button"
          disabled={isApplying}
          onClick={onApplyFilters}
          className="w-full h-10 rounded-xl font-semibold text-sm shadow-xs flex items-center justify-center gap-2"
        >
          {isApplying ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Applying...</span>
            </>
          ) : (
            <span>Apply Filters</span>
          )}
        </Button>
      </div>

      {/* Verification Notice */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border p-3.5 flex items-start gap-2.5 text-xs text-secondary-text">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          All registered doctors are BMDC-certified and verified for online practice.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-xs">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs h-full bg-card p-6 overflow-y-auto shadow-2xl z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">Filters</h3>
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="rounded-lg p-1 text-secondary-text hover:bg-muted cursor-pointer"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <Button
                type="button"
                disabled={isApplying}
                onClick={() => {
                  onApplyFilters();
                  onMobileClose?.();
                }}
                className="w-full h-11 rounded-xl font-semibold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <span>Apply Filters</span>
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
