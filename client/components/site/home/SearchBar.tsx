"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TODO: Replace with the specialties directory API (e.g. GET /specialties) once available.
const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Gynecology",
  "Neurology",
  "Orthopedics",
  "ENT",
  "General Medicine",
];

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (specialty) params.set("specialty", specialty);
    const queryString = params.toString();
    router.push(queryString ? `/doctors?${queryString}` : "/doctors");
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-1.5 sm:p-2 shadow-xl shadow-slate-900/[0.08] transition-all duration-200 focus-within:border-primary/60 focus-within:ring-3 focus-within:ring-primary/15">
        {/* Specialty selection (shadcn UI Select) — visible on tablet & desktop */}
        <div className="hidden sm:block shrink-0">
          <Select
            value={specialty || "all"}
            onValueChange={(val) => setSpecialty(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-10 sm:h-11 w-[145px] lg:w-[160px] border-none bg-transparent shadow-none hover:bg-muted/50 focus:ring-0 text-sm font-medium text-foreground px-3 rounded-xl gap-2">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent className="w-[200px] rounded-2xl border-border bg-popover/95 backdrop-blur-xl shadow-2xl">
              <SelectItem value="all">All Specialties</SelectItem>
              {SPECIALTIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden h-6 w-px shrink-0 bg-border/80 sm:block" aria-hidden="true" />

        {/* Query input */}
        <div className="flex h-10 sm:h-11 flex-1 items-center gap-2.5 rounded-xl px-2.5 sm:px-2 transition-colors min-w-0">
          <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="hero-doctor-search" className="sr-only">
            Search doctors or specialties
          </label>
          <input
            id="hero-doctor-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search doctors, specialties..."
            autoComplete="off"
            enterKeyHint="search"
            className="h-full w-full bg-transparent text-[14px] sm:text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground/75 font-normal truncate [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        {/* Primary action */}
        <Button
          type="submit"
          className="h-10 sm:h-11 shrink-0 rounded-xl px-3.5 sm:px-5.5 text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/20 transition-all cursor-pointer"
        >
          <span className="sm:hidden">Search</span>
          <span className="hidden sm:inline">Find a Doctor</span>
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;