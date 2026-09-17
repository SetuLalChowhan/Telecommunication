"use client";

import React from "react";

export const DoctorCardSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs animate-pulse">
      {/* Top Image area */}
      <div className="aspect-[4/3.2] w-full bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-300 dark:bg-slate-700/60" />
      </div>

      {/* Body content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-1/2 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-3 w-1/3 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-2/3 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-border/60">
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800 ml-auto" />
        </div>

        {/* Fee & Action Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <div className="h-2.5 w-10 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default DoctorCardSkeleton;
