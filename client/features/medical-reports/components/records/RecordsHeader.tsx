"use client";

import React from "react";
import { Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout";

interface RecordsHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onUploadClick: () => void;
}

export const RecordsHeader: React.FC<RecordsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onUploadClick,
}) => {
  return (
    <PageHeader
      eyebrow="Care"
      title="Medical records"
      description="Diagnostic reports, prescriptions and clinical documents."
      actions={
        <>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label="Search medical documents"
              placeholder="Search documents"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 rounded-md pl-8 text-xs"
            />
          </div>

          <Button
            onClick={onUploadClick}
            size="sm"
            className="h-8 shrink-0 gap-1.5 rounded-md px-3 text-xs font-semibold"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload document</span>
          </Button>
        </>
      }
    />
  );
};

export default RecordsHeader;
