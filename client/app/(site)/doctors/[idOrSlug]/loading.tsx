import React from "react";

/**
 * First-load skeleton for the doctor profile route.
 * Rendered while the Server Component awaits its prefetch, so a hard refresh
 * shows structure immediately instead of a blank screen.
 */
export default function Loading() {
  return (
    <div className="w-full bg-background min-h-screen" role="status" aria-busy="true">
      {/* Breadcrumb bar */}
      <div className="w-full border-b border-border/60 bg-muted/30 py-4">
        <div className="container-page flex items-center justify-between">
          <div className="h-4 w-48 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      <div className="container-page py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: hero, about, reviews */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-xl bg-muted" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-52 rounded-md bg-muted" />
                  <div className="h-4 w-40 rounded-md bg-muted" />
                  <div className="h-4 w-64 rounded-md bg-muted" />
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <div className="h-14 rounded-lg bg-muted" />
                    <div className="h-14 rounded-lg bg-muted" />
                    <div className="h-14 rounded-lg bg-muted" />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 rounded-xl border border-border bg-card animate-pulse" />
            <div className="h-80 rounded-xl border border-border bg-card animate-pulse" />
          </div>

          {/* Right: sticky booking widget */}
          <div className="lg:col-span-4">
            <div className="h-[520px] rounded-xl border border-border bg-card animate-pulse" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading doctor profile…</span>
    </div>
  );
}
