import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  iconSize?: number;
  showTagline?: boolean;
}

export default function BrandLogo({
  className,
  iconSize = 20,
  showTagline = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 group transition-all duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
        <Activity size={iconSize} className="stroke-[2.5]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[21px] font-bold tracking-tight text-foreground flex items-center gap-1 leading-tight">
          Tele<span className="text-primary font-extrabold">Health</span>
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
