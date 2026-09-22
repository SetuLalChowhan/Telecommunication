import { DoctorCardSkeleton } from "@/components/site/doctors/DoctorCardSkeleton";

/**
 * First-load skeleton for the doctors directory.
 * Mirrors the real layout (search header band + filter rail + card grid) so a
 * hard refresh shows structure instead of a blank screen, and nothing shifts
 * when the real content replaces it.
 */
export default function Loading() {
  return (
    <div className="w-full bg-background min-h-screen" role="status" aria-busy="true">
      {/* Search header band */}
      <div className="w-full bg-muted/30 border-b border-border/60 py-10 sm:py-12">
        <div className="container-page space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 sm:space-y-5 max-w-2xl w-full">
              <div className="h-3 w-44 rounded bg-muted animate-pulse" />
              <div className="h-8 w-full max-w-lg rounded-md bg-muted animate-pulse" />
              <div className="h-4 w-full max-w-xl rounded bg-muted/70 animate-pulse" />
            </div>
            <div className="hidden sm:block w-32 shrink-0 space-y-2">
              <div className="h-3 w-full rounded bg-muted/70 animate-pulse ml-auto" />
              <div className="h-7 w-3/4 rounded bg-muted animate-pulse ml-auto" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="h-11 flex-1 rounded-lg border border-border bg-card animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-11 w-52 sm:w-56 rounded-lg border border-border bg-card animate-pulse" />
              <div className="h-11 w-24 rounded-lg border border-border bg-card animate-pulse lg:hidden" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter rail + results grid */}
      <div className="container-page py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          <div className="hidden lg:block w-64 shrink-0 h-[420px] rounded-xl border border-border bg-card animate-pulse" />

          <div className="flex-1 w-full min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading doctors…</span>
    </div>
  );
}
