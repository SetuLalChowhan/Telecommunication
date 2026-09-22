"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Small uppercase label above the title (section / workspace area). */
  eyebrow?: string;
  title: React.ReactNode;
  /** One short line. Avoid restating the title. */
  description?: React.ReactNode;
  /** Inline facts shown next to the description, e.g. "4 total". */
  meta?: React.ReactNode;
  /** Right-aligned controls: search, filters, primary action. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Standard header for every dashboard page.
 *
 * Keeps the title block and the page controls on one baseline so inner pages
 * stop inventing their own header markup and spacing.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  meta,
  actions,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        {eyebrow ? <p className="data-label">{eyebrow}</p> : null}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="page-title" suppressHydrationWarning>
            {title}
          </h1>
          {meta ? (
            <span className="text-xs font-medium text-muted-foreground">
              {meta}
            </span>
          ) : null}
        </div>
        {description ? <p className="page-subtitle">{description}</p> : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
};

export default PageHeader;
