"use client";

import React, { useState } from "react";
import { DoctorProfile, DoctorAvailability } from "@/types/doctor";
import {
  Calendar,
  Clock,
  Video,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface DoctorBookingSidebarProps {
  doctor: DoctorProfile;
  availabilities: DoctorAvailability[];
}

export const DoctorBookingSidebar: React.FC<DoctorBookingSidebarProps> = ({
  doctor,
  availabilities,
}) => {
  const [consultationType, setConsultationType] = useState<"VIDEO" | "IN_CLINIC">("VIDEO");
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Generate next 7 days for selection
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      dayOfWeek: d.getDay(),
    };
  });

  const activeDay = days[selectedDayIdx];

  // Derive time slots for the active day
  const matchingAvailabilities = availabilities.filter(
    (a) => a.dayOfWeek === activeDay.dayOfWeek && a.isActive
  );

  // Generate sample slot pills for rich interactivity
  const timeSlots = matchingAvailabilities.length > 0
    ? matchingAvailabilities.map((a) => `${a.startTime} - ${a.endTime}`)
    : ["10:00 AM", "11:30 AM", "03:00 PM", "05:30 PM", "07:00 PM"];

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setSelectedSlot(timeSlots[0]);
    }
    setIsBooked(true);
  };

  return (
    <div className="sticky top-24 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card p-6 sm:p-7 shadow-lg space-y-6">
      {/* Price Header */}
      <div className="pb-4 border-b border-border/60 flex items-center justify-between">
        <div>
          <span className="text-xs text-secondary-text block font-medium">
            Consultation Fee
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-black text-primary">
              ৳{doctor.fee || 500}
            </span>
            <span className="text-xs text-secondary-text font-normal">/ session</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1 text-xs font-semibold border border-emerald-500/20">
          <Sparkles className="h-3 w-3" />
          <span>Instant Slot</span>
        </div>
      </div>

      {isBooked ? (
        /* Booking Confirmation State */
        <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Appointment Requested!</h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              You selected <span className="font-semibold text-foreground">{consultationType === "VIDEO" ? "Video Call" : "In-Clinic Visit"}</span> on{" "}
              <span className="font-semibold text-foreground">
                {activeDay.dayName}, {activeDay.month} {activeDay.dayNum}
              </span>{" "}
              at <span className="font-semibold text-foreground">{selectedSlot || timeSlots[0]}</span>.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 text-xs text-left space-y-1.5">
            <div className="flex justify-between text-secondary-text">
              <span>Doctor:</span>
              <span className="font-semibold text-foreground">{doctor.user.name || "Dr. Specialist"}</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Fee:</span>
              <span className="font-semibold text-primary">৳{doctor.fee || 500}</span>
            </div>
            <div className="flex justify-between text-secondary-text">
              <span>Status:</span>
              <span className="font-semibold text-emerald-600">Confirmed (Demo)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBooked(false)}
            className="w-full rounded-full border border-border/80 bg-card hover:bg-muted text-foreground py-2.5 text-xs font-semibold transition-all"
          >
            Change Appointment
          </button>
        </div>
      ) : (
        /* Interactive Booking Form */
        <form onSubmit={handleBookNow} className="space-y-5">
          {/* 1. Consultation Type Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>1. Consultation Mode</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setConsultationType("VIDEO")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  consultationType === "VIDEO"
                    ? "border-primary bg-primary/10 text-primary shadow-2xs font-semibold"
                    : "border-border/80 bg-card text-secondary-text hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Video className="h-4 w-4 mb-1" />
                <span className="text-xs">Video Call</span>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType("IN_CLINIC")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  consultationType === "IN_CLINIC"
                    ? "border-primary bg-primary/10 text-primary shadow-2xs font-semibold"
                    : "border-border/80 bg-card text-secondary-text hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Building2 className="h-4 w-4 mb-1" />
                <span className="text-xs">Hospital Visit</span>
              </button>
            </div>
          </div>

          {/* 2. Date Selection (Next 7 Days Carousel) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>2. Select Date</span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {days.map((day, idx) => {
                const isSelected = selectedDayIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedDayIdx(idx);
                      setSelectedSlot("");
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-border/80 bg-card text-secondary-text hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {day.dayName}
                    </span>
                    <span className="text-sm font-black mt-0.5">{day.dayNum}</span>
                    <span className="text-[9px] opacity-80">{day.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Time Slots */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>3. Available Time Slots</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot, idx) => {
                const isSelected = selectedSlot === slot || (!selectedSlot && idx === 0);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all truncate ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/80 bg-card text-secondary-text hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white py-3.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-primary/25 transition-all"
          >
            <span>Proceed to Book</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {/* Trust & Guarantee Badges */}
      <div className="pt-3 border-t border-border/60 space-y-2 text-[11px] text-secondary-text">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
          <span>100% Encrypted Video & Patient Data</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <span>Free rescheduling up to 2 hours before</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorBookingSidebar;
