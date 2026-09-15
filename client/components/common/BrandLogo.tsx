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
        "inline-flex items-center gap-2.5 group transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg",
        className
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
        <Activity size={iconSize} className="stroke-[2.5]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[19px] font-bold tracking-tight text-foreground flex items-center gap-1">
          Tele<span className="text-secondary font-extrabold">Health</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-muted-foreground -mt-0.5 tracking-wide">
            Care Anytime, Anywhere
          </span>
        )}
      </div>
    </Link>
  );
}
