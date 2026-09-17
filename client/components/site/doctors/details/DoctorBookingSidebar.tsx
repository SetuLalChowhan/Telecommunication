"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { DoctorProfile, DoctorAvailability } from "@/types/doctor";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DoctorBookingSidebarProps {
  doctor: DoctorProfile;
  availabilities: DoctorAvailability[];
}

const DAY_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

function parseDayOfWeek(day: unknown): number {
  if (typeof day === "number") return day;
  if (typeof day === "string") {
    const key = day.trim().toUpperCase();
    if (key in DAY_MAP) return DAY_MAP[key];
    const parsed = Number(key);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return -1;
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const isPM = /pm/i.test(timeStr);
  const isAM = /am/i.test(timeStr);
  const clean = timeStr.replace(/[^\d:]/g, "").trim();
  const parts = clean.split(":").map(Number);
  let hours = parts[0] || 0;
  const minutes = parts[1] || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function minutesToTimeSlot(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const padHours = String(hours12).padStart(2, "0");
  const padMins = String(minutes).padStart(2, "0");
  return `${padHours}:${padMins} ${period}`;
}

export const DoctorBookingSidebar: React.FC<DoctorBookingSidebarProps> = ({
  doctor,
  availabilities = [],
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  // Combine availability sources
  const allAvailabilities: DoctorAvailability[] = useMemo(() => {
    if (availabilities && availabilities.length > 0) return availabilities;
    if ((doctor as any)?.availability && (doctor as any).availability.length > 0)
      return (doctor as any).availability;
    if (doctor.availabilities && doctor.availabilities.length > 0)
      return doctor.availabilities;
    return [];
  }, [availabilities, doctor]);

  // Generate 14 days
  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return {
        date: d,
        dayName:
          i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        dayOfWeek: d.getDay(),
      };
    });
  }, []);

  const activeDate = customDate || days[selectedDayIdx].date;
  const activeDayLabel = {
    dayName:
      activeDate.toDateString() === new Date().toDateString()
        ? "Today"
        : activeDate.toLocaleDateString("en-US", { weekday: "short" }),
    dayNum: activeDate.getDate(),
    month: activeDate.toLocaleDateString("en-US", { month: "short" }),
  };

  // Check if activeDate is a doctor's scheduled day off
  const isDayOff = useMemo(() => {
    const daysOff = (doctor as any)?.daysOff || [];
    return daysOff.some((off: any) => {
      if (!off.date) return false;
      const offDate = new Date(off.date);
      return offDate.toDateString() === activeDate.toDateString();
    });
  }, [doctor, activeDate]);

  // Dynamically compute slots for active date based on doctor availability
  const { morningSlots, eveningSlots, allSlots } = useMemo(() => {
    if (isDayOff) {
      return { morningSlots: [], eveningSlots: [], allSlots: [] };
    }

    const activeDayOfWeek = activeDate.getDay();

    const matchingRules = allAvailabilities.filter((rule) => {
      if (rule.isActive === false) return false;
      return parseDayOfWeek(rule.dayOfWeek) === activeDayOfWeek;
    });

    const generated: { time: string; totalMinutes: number }[] = [];

    matchingRules.forEach((rule) => {
      const startMins = parseTimeToMinutes(rule.startTime);
      const endMins = parseTimeToMinutes(rule.endTime);
      const duration = Number(rule.consultationDuration) || 30;

      for (let m = startMins; m + duration <= endMins; m += duration) {
        generated.push({
          time: minutesToTimeSlot(m),
          totalMinutes: m,
        });
      }
    });

    // Deduplicate & sort chronologically
    const uniqueMap = new Map<string, number>();
    generated.forEach((item) => {
      if (!uniqueMap.has(item.time)) {
        uniqueMap.set(item.time, item.totalMinutes);
      }
    });

    const sortedSlots = Array.from(uniqueMap.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([time, totalMinutes]) => ({ time, totalMinutes }));

    const morning = sortedSlots
      .filter((s) => s.totalMinutes < 12 * 60)
      .map((s) => s.time);

    const evening = sortedSlots
      .filter((s) => s.totalMinutes >= 12 * 60)
      .map((s) => s.time);

    return {
      morningSlots: morning,
      eveningSlots: evening,
      allSlots: sortedSlots.map((s) => s.time),
    };
  }, [activeDate, allAvailabilities, isDayOff]);

  // Auto-sync selected slot when active date changes
  useEffect(() => {
    if (allSlots.length > 0) {
      if (!allSlots.includes(selectedSlot)) {
        setSelectedSlot(allSlots[0]);
      }
    } else {
      setSelectedSlot("");
    }
  }, [allSlots, selectedSlot]);

  // Mouse drag-to-scroll implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleSlide = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCalendarSelect = (date: Date) => {
    setCustomDate(date);
    setIsCalendarOpen(false);

    const matchIdx = days.findIndex(
      (d) => d.date.toDateString() === date.toDateString()
    );
    if (matchIdx !== -1) {
      setSelectedDayIdx(matchIdx);
    }
  };

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setIsBooked(true);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-6">
      {/* Price Header */}
      <div className="pb-4 border-b border-border/60 flex items-center justify-between">
        <div>
          <span className="text-xs text-muted-foreground block font-medium">
            Consultation Fee
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">
              ৳{Number(doctor.fee ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">/ session</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
          <Video className="h-3.5 w-3.5" />
          <span>Live Video</span>
        </div>
      </div>

      {isBooked ? (
        /* Confirmed Booking State */
        <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              Consultation Booked
            </h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              Your online video appointment with{" "}
              <span className="font-semibold text-foreground">
                {doctor.user?.name || "Doctor"}
              </span>{" "}
              is confirmed for:
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/70 text-xs text-left space-y-2">
            <div className="flex justify-between text-secondary-text">
              <span>Date:</span>
              <span className="font-semibold text-foreground">
                {activeDayLabel.dayName}, {activeDayLabel.month}{" "}
                {activeDayLabel.dayNum}
              </span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Time Slot:</span>
              <span className="font-semibold text-primary">{selectedSlot}</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Fee:</span>
              <span className="font-semibold text-foreground">
                ৳{Number(doctor.fee ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBooked(false)}
            className="w-full py-2.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            Select Another Slot
          </button>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleBookNow} className="space-y-5">
          {/* 1. Date Selection with Mouse Drag Slide & Calendar Popover */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                <span>Select Appointment Date</span>
              </label>

              {/* Calendar Popover Button & Slide Controls */}
              <div className="flex items-center gap-1.5">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-lg border border-primary/20 transition-all cursor-pointer shadow-2xs"
                      title="Open interactive calendar"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>
                        {activeDayLabel.month} {activeDayLabel.dayNum}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-auto p-3 bg-card border-border shadow-2xl rounded-2xl"
                  >
                    <Calendar
                      selected={activeDate}
                      onSelect={handleCalendarSelect}
                      minDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>

                {/* Left / Right Slide Arrow Buttons */}
                <button
                  type="button"
                  onClick={() => handleSlide("left")}
                  className="h-6 w-6 rounded-md border border-border bg-card hover:border-primary hover:text-primary flex items-center justify-center text-secondary-text transition-all cursor-pointer"
                  aria-label="Slide dates left"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSlide("right")}
                  className="h-6 w-6 rounded-md border border-border bg-card hover:border-primary hover:text-primary flex items-center justify-center text-secondary-text transition-all cursor-pointer"
                  aria-label="Slide dates right"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Mouse-Drag & Scroll-friendly Date Carousel */}
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onWheel={handleWheel}
              className="flex gap-2 overflow-x-auto pb-1 scroll-smooth select-none cursor-grab active:cursor-grabbing scrollbar-none no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {days.map((day, idx) => {
                const isSelected =
                  activeDate.toDateString() === day.date.toDateString();

                return (
                  <button
                    key={day.date.toISOString()}
                    type="button"
                    onClick={() => {
                      setCustomDate(null);
                      setSelectedDayIdx(idx);
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-[58px] py-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary text-white shadow-xs font-bold ring-2 ring-primary/20"
                        : "border-border bg-card text-secondary-text hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-medium">
                      {day.dayName}
                    </span>
                    <span className="text-sm font-bold mt-0.5">
                      {day.dayNum}
                    </span>
                    <span className="text-[9px] opacity-80">{day.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Available Time Slots (Dynamically Generated) */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Available Time Slots</span>
            </label>

            {allSlots.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-border text-center space-y-1">
                <AlertCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  {isDayOff ? "Doctor is on Day Off" : "No Slots Available"}
                </p>
                <p className="text-[11px] text-secondary-text">
                  Doctor has no consultation schedule on {activeDayLabel.dayName}. Please pick another date.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Morning Slots */}
                {morningSlots.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider block">
                      Morning Sessions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {morningSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "border-2 border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20 shadow-2xs"
                                : "border border-border bg-card text-secondary-text hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Afternoon / Evening Slots */}
                {eveningSlots.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider block">
                      Afternoon & Evening Sessions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {eveningSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "border-2 border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20 shadow-2xs"
                                : "border border-border bg-card text-secondary-text hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Book CTA */}
          <button
            type="submit"
            disabled={!selectedSlot}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-xs transition-all ${
              selectedSlot
                ? "bg-primary hover:bg-primary-dark text-white cursor-pointer active:scale-[0.99]"
                : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
            }`}
          >
            <span>Book Video Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {/* Trust Badges */}
      <div className="pt-3.5 border-t border-border/60 space-y-2 text-xs text-secondary-text">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Encrypted Video Call & Protected Health Data</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Free cancellation up to 2 hours before session</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorBookingSidebar;
