"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About Us" },
];

export const DesktopNavigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-8">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 text-sm tracking-[-0.02em] transition-colors rounded-full",
              isActive
                ? "font-medium text-foreground"
                : "font-normal text-foreground/75 hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};
