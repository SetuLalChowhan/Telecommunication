"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/consult", label: "Consult" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export const DesktopNavigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-7">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1.5 text-sm tracking-[-0.01em] transition-colors rounded-full",
              isActive
                ? "font-semibold text-foreground bg-muted/60"
                : "font-normal text-foreground/80 hover:text-foreground hover:bg-muted/40"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};
