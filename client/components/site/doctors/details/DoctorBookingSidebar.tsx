"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DoctorBookingSidebarProps {
  doctor: DoctorProfile;
  availabilities: DoctorAvailability[];
}

export const DoctorBookingSidebar: React.FC<DoctorBookingSidebarProps> = ({
  doctor,
  availabilities,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("10:00 AM");
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  // Generate 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return {
      date: d,
      dayName: i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      dayOfWeek: d.getDay(),
    };
  });

  const activeDate = customDate || days[selectedDayIdx].date;
  const activeDayLabel = {
    dayName: activeDate.toDateString() === new Date().toDateString() ? "Today" : activeDate.toLocaleDateString("en-US", { weekday: "short" }),
    dayNum: activeDate.getDate(),
    month: activeDate.toLocaleDateString("en-US", { month: "short" }),
  };

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

  // Wheel horizontal scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Arrow button slide
  const handleSlide = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Calendar date select
  const handleCalendarSelect = (date: Date) => {
    setCustomDate(date);
    setIsCalendarOpen(false);

    // If selected date is in our 14-day list, sync active index
    const matchIdx = days.findIndex(
      (d) => d.date.toDateString() === date.toDateString()
    );
    if (matchIdx !== -1) {
      setSelectedDayIdx(matchIdx);
    }
  };

  // Available slots
  const morningSlots = ["09:30 AM", "10:00 AM", "11:00 AM", "11:30 AM"];
  const eveningSlots = ["04:30 PM", "05:00 PM", "06:30 PM", "07:00 PM"];

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-md space-y-6">
      {/* Price Header */}
      <div className="pb-4 border-b border-border flex items-center justify-between">
        <div>
          <span className="text-xs text-secondary-text block font-medium">
            Consultation Fee
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">
              ৳{doctor.fee || 500}
            </span>
            <span className="text-xs text-secondary-text">/ video session</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">
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
            <h3 className="text-lg font-bold text-foreground">Consultation Booked</h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              Your online video appointment with{" "}
              <span className="font-semibold text-foreground">
                {doctor.user.name || "Dr. Specialist"}
              </span>{" "}
              is confirmed for:
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border text-xs text-left space-y-2">
            <div className="flex justify-between text-secondary-text">
              <span>Date:</span>
              <span className="font-semibold text-foreground">
                {activeDayLabel.dayName}, {activeDayLabel.month} {activeDayLabel.dayNum}
              </span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Time Slot:</span>
              <span className="font-semibold text-primary">{selectedSlot}</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Mode:</span>
              <span className="font-semibold text-foreground">Encrypted HD Video</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Status:</span>
              <span className="font-semibold text-emerald-600">Confirmed (Demo)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBooked(false)}
            className="w-full rounded-xl border border-border bg-card hover:bg-muted text-foreground py-2.5 text-xs font-semibold transition-all cursor-pointer"
          >
            Select Another Slot
          </button>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleBookNow} className="space-y-5">
          {/* 1. Date Selection with Mouse Drag Slide & Shadcn Calendar Popover */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                <span>Select Appointment Date</span>
              </label>

              {/* Shadcn Calendar Popover Button & Slide Controls */}
              <div className="flex items-center gap-1.5">
                {/* Shadcn UI Popover Calendar Trigger */}
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-lg border border-primary/20 transition-all cursor-pointer shadow-2xs"
                      title="Open interactive calendar"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{activeDayLabel.month} {activeDayLabel.dayNum}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto p-3 bg-card border-border shadow-2xl rounded-2xl">
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
                    <span className="text-sm font-bold mt-0.5">{day.dayNum}</span>
                    <span className="text-[9px] opacity-80">{day.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Available Time Slots */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Available Time Slots</span>
            </label>

            {/* Morning */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-secondary-text">Morning</span>
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

            {/* Evening */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-medium text-secondary-text">Evening</span>
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
          </div>

          {/* Book CTA */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white py-3 text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span>Book Video Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {/* Trust Badges */}
      <div className="pt-3 border-t border-border space-y-2 text-xs text-secondary-text">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Encrypted Video Call & Protected Medical Data</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Reschedule anytime before 2 hours of session</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorBookingSidebar;
