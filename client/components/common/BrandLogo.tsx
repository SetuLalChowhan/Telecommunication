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
        "group inline-flex items-center rounded-xl transition-all duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        compact ? "gap-2" : "gap-2.5",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-primary text-white transition-transform duration-200 group-hover:scale-105",
          compact
            ? "h-8 w-8 rounded-lg"
            : "h-10 w-10 rounded-xl shadow-md shadow-primary/25"
        )}
      >
        <Activity size={iconSize} className="stroke-[2.5]" />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "flex items-center gap-1 font-bold leading-tight tracking-tight text-foreground",
            compact ? "text-[17px]" : "text-[21px]"
          )}
        >
          Tele<span className="font-extrabold text-primary">Health</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
            Care Anytime, Anywhere
          </span>
        )}
      </div>
    </Link>
  );
}
