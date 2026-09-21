"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DoctorProfile, DoctorAvailability } from "@/types/doctor";
import { useAuth } from "@/lib/api";
import {
  useAvailableSlots,
  useCreateAppointmentBooking,
  AvailableSlotItem,
  RawBooking,
} from "@/features/patients";
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
  Loader2,
  FileText,
  LogIn,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "react-toastify";

interface DoctorBookingSidebarProps {
  doctor: DoctorProfile;
  availabilities?: DoctorAvailability[];
  isLoading?: boolean;
}

function formatToDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function format12Hour(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  const h = Number(hStr);
  const m = Number(mStr) || 0;
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export const DoctorBookingSidebar: React.FC<DoctorBookingSidebarProps> = ({
  doctor,
  availabilities = [],
  isLoading = false,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isSessionLoading } = useAuth();
  const isPatient = user?.role === "PATIENT";

  // Date selection state
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // Selected concrete slot from backend
  const [selectedSlotItem, setSelectedSlotItem] = useState<AvailableSlotItem | null>(null);

  // Consultation notes / symptoms input
  const [notes, setNotes] = useState<string>("");

  // Post-booking confirmed state
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookedDetails, setBookedDetails] = useState<RawBooking | null>(null);

  // Drag-to-scroll refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  // Generate next 14 days
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
  const activeDateStr = useMemo(() => formatToDateInput(activeDate), [activeDate]);

  const activeDayLabel = {
    dayName:
      activeDate.toDateString() === new Date().toDateString()
        ? "Today"
        : activeDate.toLocaleDateString("en-US", { weekday: "short" }),
    dayNum: activeDate.getDate(),
    month: activeDate.toLocaleDateString("en-US", { month: "short" }),
  };

  // Real-time slot availability from backend API
  const {
    data: slotsData,
    isLoading: isSlotsLoading,
    isError: isSlotsError,
    error: slotsError,
    refetch: refetchSlots,
  } = useAvailableSlots(doctor.id, activeDateStr);

  // Booking mutation
  const createBookingMutation = useCreateAppointmentBooking();

  // Auto-select first available slot whenever date or slots data changes
  useEffect(() => {
    if (slotsData?.slots && slotsData.slots.length > 0) {
      const firstAvail = slotsData.slots.find((s) => s.isAvailable);
      setSelectedSlotItem((prev) => {
        if (
          prev &&
          slotsData.slots.some(
            (s) => s.slotStart === prev.slotStart && s.isAvailable
          )
        ) {
          return prev;
        }
        return firstAvail || null;
      });
    } else {
      setSelectedSlotItem(null);
    }
  }, [slotsData]);

  // Group slots into Morning vs Afternoon / Evening
  const { morningSlots, eveningSlots } = useMemo(() => {
    const all = slotsData?.slots || [];
    const morning: AvailableSlotItem[] = [];
    const evening: AvailableSlotItem[] = [];

    all.forEach((item) => {
      const [h] = item.startTime.split(":").map(Number);
      if (h < 12) {
        morning.push(item);
      } else {
        evening.push(item);
      }
    });

    return { morningSlots: morning, eveningSlots: evening };
  }, [slotsData]);

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

    if (!isAuthenticated) {
      toast.info("Please sign in to your patient account to book a consultation.");
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/doctors/${doctor.slug || doctor.id}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!isPatient) {
      toast.warning("Doctors cannot book appointments. Please use a patient account.");
      return;
    }

    if (!selectedSlotItem) {
      toast.error("Please select an available consultation time slot.");
      return;
    }

    createBookingMutation.mutate(
      {
        doctorId: doctor.id,
        slotStart: selectedSlotItem.slotStart,
        slotEnd: selectedSlotItem.slotEnd,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: (booking) => {
          setBookedDetails(booking);
          setIsBooked(true);
        },
      }
    );
  };

  const doctorName =
    doctor.user?.name ||
    `${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim() ||
    "Specialist";

  const primarySpecialty =
    doctor.specialties?.find((s) => s.isPrimary)?.specialty?.name ||
    doctor.specialties?.[0]?.specialty?.name ||
    "General Physician";

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
        /* Confirmed / Submitted State */
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase tracking-wide">
              Status: Pending Doctor Confirmation
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Appointment Request Submitted
            </h3>
            <p className="text-xs text-secondary-text leading-relaxed px-1">
              Your consultation request has been placed with{" "}
              <span className="font-semibold text-foreground">
                Dr. {doctorName}
              </span>
              . Once the doctor reviews and confirms, your Google Meet video link will be generated automatically.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/70 text-xs text-left space-y-2.5">
            {bookedDetails?.id && (
              <div className="flex justify-between text-secondary-text pb-1.5 border-b border-border/60">
                <span>Booking ID:</span>
                <span className="font-mono font-semibold text-foreground">
                  #{bookedDetails.id.slice(-8).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex justify-between text-secondary-text">
              <span>Doctor:</span>
              <span className="font-semibold text-foreground">
                Dr. {doctorName} ({primarySpecialty})
              </span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Date:</span>
              <span className="font-semibold text-foreground">
                {activeDayLabel.dayName}, {activeDayLabel.month}{" "}
                {activeDayLabel.dayNum}
              </span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Time Slot:</span>
              <span className="font-semibold text-primary">
                {selectedSlotItem
                  ? `${format12Hour(selectedSlotItem.startTime)} - ${format12Hour(selectedSlotItem.endTime)}`
                  : "Scheduled"}
              </span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Consultation Fee:</span>
              <span className="font-semibold text-foreground">
                ৳{Number(doctor.fee ?? 0).toLocaleString()}
              </span>
            </div>
            {notes.trim() && (
              <div className="pt-1.5 border-t border-border/60">
                <span className="text-[11px] text-muted-foreground block mb-0.5 font-medium">
                  Reason for visit:
                </span>
                <p className="text-xs text-foreground bg-card p-2 rounded-lg border border-border/60">
                  {notes.trim()}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <Link
              href="/patient/appointments"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white py-2.5 text-xs font-semibold shadow-xs transition-all"
            >
              <span>View in My Appointments</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsBooked(false);
                setBookedDetails(null);
                setNotes("");
                refetchSlots();
              }}
              className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Book Another Slot
            </button>
          </div>
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

          {/* 2. Available Time Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Available Consultation Slots</span>
              </label>
              {isSlotsLoading && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  Checking slots...
                </span>
              )}
            </div>

            {isSlotsLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl bg-muted/60 animate-pulse border border-border/40"
                  />
                ))}
              </div>
            ) : isSlotsError ? (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center space-y-2">
                <AlertCircle className="h-5 w-5 text-destructive mx-auto" />
                <p className="text-xs font-semibold text-destructive">
                  Could not load schedule slots
                </p>
                <button
                  type="button"
                  onClick={() => refetchSlots()}
                  className="text-xs font-semibold text-primary underline cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : slotsData?.isDayOff ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1.5">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mx-auto" />
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Doctor is on Day Off
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  {slotsData.reason || `Dr. ${doctorName} is unavailable on ${activeDayLabel.dayName}. Please choose another date.`}
                </p>
              </div>
            ) : !slotsData?.slots || slotsData.slots.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-border text-center space-y-1">
                <AlertCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  No Consultation Slots Available
                </p>
                <p className="text-[11px] text-secondary-text">
                  Doctor has no active schedule on {activeDayLabel.dayName}. Please pick another date.
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
                        const isSelected = selectedSlotItem?.slotStart === slot.slotStart;
                        const isAvail = slot.isAvailable;

                        return (
                          <button
                            key={slot.slotStart}
                            type="button"
                            disabled={!isAvail}
                            onClick={() => setSelectedSlotItem(slot)}
                            className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all relative ${
                              !isAvail
                                ? "border-border/50 bg-muted/40 text-muted-foreground/60 cursor-not-allowed opacity-60 line-through"
                                : isSelected
                                ? "border-2 border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20 shadow-2xs cursor-pointer"
                                : "border border-border bg-card text-secondary-text hover:border-primary/40 hover:text-foreground cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              <span>{format12Hour(slot.startTime)}</span>
                            </div>
                            {!isAvail && (
                              <span className="block text-[9px] no-underline font-normal text-muted-foreground">
                                Booked
                              </span>
                            )}
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
                        const isSelected = selectedSlotItem?.slotStart === slot.slotStart;
                        const isAvail = slot.isAvailable;

                        return (
                          <button
                            key={slot.slotStart}
                            type="button"
                            disabled={!isAvail}
                            onClick={() => setSelectedSlotItem(slot)}
                            className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all relative ${
                              !isAvail
                                ? "border-border/50 bg-muted/40 text-muted-foreground/60 cursor-not-allowed opacity-60 line-through"
                                : isSelected
                                ? "border-2 border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20 shadow-2xs cursor-pointer"
                                : "border border-border bg-card text-secondary-text hover:border-primary/40 hover:text-foreground cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              <span>{format12Hour(slot.startTime)}</span>
                            </div>
                            {!isAvail && (
                              <span className="block text-[9px] no-underline font-normal text-muted-foreground">
                                Booked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Reason for Consultation / Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>Reason for Consultation (Optional)</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {notes.length}/500
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              rows={2}
              placeholder="e.g. Follow-up consultation for hypertension, fever, or medication advice..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
            />
          </div>

          {/* Role Warning for Doctors or Admins */}
          {isAuthenticated && !isPatient && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Logged in as {user?.role}</span>
                <span className="opacity-90">
                  Doctor or admin accounts cannot book patient consultations. Please sign in with a registered patient account.
                </span>
              </div>
            </div>
          )}

          {/* Book CTA / Auth CTA */}
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                const currentPath =
                  typeof window !== "undefined"
                    ? window.location.pathname
                    : `/doctors/${doctor.slug || doctor.id}`;
                router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-xs transition-all bg-primary hover:bg-primary-dark text-white cursor-pointer active:scale-[0.99]"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In as Patient to Book</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                !selectedSlotItem ||
                !isPatient ||
                createBookingMutation.isPending ||
                isSlotsLoading
              }
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-xs transition-all ${
                selectedSlotItem && isPatient && !createBookingMutation.isPending
                  ? "bg-primary hover:bg-primary-dark text-white cursor-pointer active:scale-[0.99]"
                  : "bg-muted text-muted-foreground cursor-not-allowed border border-border opacity-70"
              }`}
            >
              {createBookingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>
                    Book Consultation (৳{Number(doctor.fee ?? 0).toLocaleString()})
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
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
