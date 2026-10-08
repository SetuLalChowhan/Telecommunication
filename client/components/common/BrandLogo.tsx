import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  iconSize?: number;
  showTagline?: boolean;
  /** Tighter mark used inside the dashboard rail and topbars. */
  compact?: boolean;
}

export default function BrandLogo({
  className,
  iconSize = 20,
  showTagline = false,
  compact = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center rounded-full transition-all duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact ? "gap-2" : "gap-2.5",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-[#f3f1eb] text-foreground border border-border transition-colors group-hover:border-[#cbcbcb]",
          compact
            ? "h-7 w-7"
            : "h-9 w-9"
        )}
      >
        <Activity size={iconSize} className="stroke-[2] text-foreground" />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "flex items-center gap-1 font-medium leading-tight tracking-[-0.03em] text-foreground",
            compact ? "text-[16px]" : "text-[18px]"
          )}
        >
          Tele<span className="font-semibold text-foreground">Health</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-normal text-muted-foreground tracking-normal">
            Care Anytime, Anywhere
          </span>
        )}
      </div>
    </Link>
  );
}
