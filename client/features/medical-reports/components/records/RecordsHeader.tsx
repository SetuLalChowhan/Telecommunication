"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Medical Records & Prescriptions</h1>
        <p className="text-sm text-muted-foreground">
          Access diagnostic reports, digital prescriptions, and clinical history.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 rounded-xl text-sm"
          />
        </div>

        <Button
          onClick={onUploadClick}
          className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Document</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </div>
    </div>
  );
};
