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
    <nav className="flex items-center gap-7 lg:gap-8">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium tracking-tight transition-colors py-1.5 relative",
              isActive
                ? "text-primary font-semibold"
                : "text-foreground/80 hover:text-primary"
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
