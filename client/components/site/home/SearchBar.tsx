"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-border/80 bg-card p-1.5 sm:p-2 shadow-md shadow-slate-900/[0.04] transition-all duration-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
        {/* Specialty selection — desktop only */}
        <div className="relative hidden md:block shrink-0">
          <select
            aria-label="Select a specialty"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="h-10 sm:h-11 w-[135px] cursor-pointer appearance-none rounded-xl bg-transparent pl-3 pr-7 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/50"
          >
            <option value="">All Specialties</option>
            {SPECIALTIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <div className="hidden h-6 w-px shrink-0 bg-border md:block" aria-hidden="true" />

        {/* Query input */}
        <div className="flex h-10 sm:h-11 flex-1 items-center gap-2 rounded-xl px-2.5 sm:px-2 transition-colors min-w-0">
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