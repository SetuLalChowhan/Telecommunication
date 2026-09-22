"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Loader2, Search, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDoctorSuggestions, useSpecialties } from "@/features/doctors";
import type { Specialty } from "@/features/doctors";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  /**
   * Specialties prefetched on the server. Passing them means the select renders
   * populated on first paint and never refetches on mount.
   */
  initialSpecialties?: Specialty[];
}

const SearchBar = ({ initialSpecialties = [] }: SearchBarProps) => {
  const router = useRouter();
  const listId = useId();

  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Typing stays instant; only the settled value is sent to the API.
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: suggestions = [], isFetching } = useDoctorSuggestions(debouncedQuery);
  const { data: specialties = initialSpecialties } = useSpecialties({
    initialData: initialSpecialties.length ? initialSpecialties : undefined,
  });

  const showSuggestions =
    isOpen && debouncedQuery.trim().length >= 2 && query.trim().length >= 2;

  // Close when the pointer lands outside the combobox.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  // Keep the highlighted row in range as results change.
  useEffect(() => {
    setActiveIndex((current) =>
      current >= suggestions.length ? suggestions.length - 1 : current
    );
  }, [suggestions.length]);

  const goToDoctors = (term: string, specialtySlug: string) => {
    const params = new URLSearchParams();
    if (term.trim()) params.set("q", term.trim());
    if (specialtySlug) params.set("specialty", specialtySlug);
    const queryString = params.toString();
    router.push(queryString ? `/doctors?${queryString}` : "/doctors");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const active = suggestions[activeIndex];

    if (showSuggestions && active) {
      setIsOpen(false);
      router.push(`/doctors/${active.slug}`);
      return;
    }

    goToDoctors(query, specialty);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!showSuggestions || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full">
      <div
        ref={containerRef}
        className="relative flex items-center gap-1.5 rounded-xl border border-border bg-card p-1.5 shadow-subtle transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 sm:gap-2 sm:p-2"
      >
        {/* Specialty selection — visible on tablet & desktop */}
        <div className="hidden shrink-0 sm:block">
          <Select
            value={specialty || "all"}
            onValueChange={(val) => setSpecialty(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-10 w-[150px] gap-2 rounded-lg border-none bg-transparent px-3 text-sm font-medium text-foreground shadow-none hover:bg-muted/50 focus:ring-0 lg:w-[165px]">
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent className="max-h-72 w-[230px] border-border bg-popover">
              <SelectItem value="all">All specialties</SelectItem>
              {specialties.map((item) => (
                <SelectItem key={item.id} value={item.slug}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden h-6 w-px shrink-0 bg-border sm:block" aria-hidden="true" />

        {/* Query input */}
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 sm:h-11">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="hero-doctor-search" className="sr-only">
            Search doctors or specialties
          </label>
          <input
            id="hero-doctor-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search doctors, specialties..."
            autoComplete="off"
            enterKeyHint="search"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
            }
            className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          {isFetching && showSuggestions && (
            <Loader2
              className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Primary action */}
        <Button
          type="submit"
          className="h-10 shrink-0 rounded-lg px-4 text-sm font-semibold sm:h-11 sm:px-5"
        >
          <span className="sm:hidden">Search</span>
          <span className="hidden sm:inline">Find a doctor</span>
        </Button>

        {/* Suggestions */}
        {showSuggestions && (
          <div
            id={listId}
            role="listbox"
            aria-label="Doctor suggestions"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
          >
            {suggestions.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto p-1.5">
                {suggestions.map((doctor, index) => (
                  <li key={doctor.id}>
                    <Link
                      id={`${listId}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      href={`/doctors/${doctor.slug}`}
                      onClick={() => setIsOpen(false)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors",
                        index === activeIndex ? "bg-muted" : "hover:bg-muted/60"
                      )}
                    >
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                        {doctor.image ? (
                          <Image
                            src={doctor.image}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <Stethoscope className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-foreground">
                            {doctor.name}
                          </span>
                          {doctor.verified && (
                            <ShieldCheck
                              className="h-3.5 w-3.5 shrink-0 text-primary"
                              aria-label="Verified doctor"
                            />
                          )}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {doctor.specialty}
                          {doctor.experienceYears
                            ? ` · ${doctor.experienceYears} yrs exp`
                            : ""}
                        </span>
                      </span>

                      <span className="shrink-0 text-xs font-semibold text-foreground">
                        ৳{doctor.fee}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3.5 py-3 text-xs text-muted-foreground">
                {isFetching
                  ? "Searching doctors…"
                  : `No doctors found for “${debouncedQuery.trim()}”.`}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                goToDoctors(query, specialty);
              }}
              className="flex w-full cursor-pointer items-center gap-2 border-t border-border bg-muted/40 px-3.5 py-2.5 text-left text-xs font-semibold text-primary transition-colors hover:bg-muted"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>See all results for “{query.trim()}”</span>
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
