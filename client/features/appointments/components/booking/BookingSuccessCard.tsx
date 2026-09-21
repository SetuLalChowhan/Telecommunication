"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Calendar, Clock, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RawBooking } from "@/features/patients";

interface BookingSuccessCardProps {
  booking: RawBooking;
  onBookAnother: () => void;
}

export const BookingSuccessCard: React.FC<BookingSuccessCardProps> = ({
  booking,
  onBookAnother,
}) => {
  const slotDate = new Date(booking.slotStart);
  const dateFormatted = slotDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatted = slotDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-lg text-center space-y-5 animate-in zoom-in-95 duration-200">
      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">Appointment Booked!</h3>
        <p className="text-xs text-muted-foreground">
          Your video consultation request has been submitted and confirmed.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs text-left space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Date</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {dateFormatted}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Time</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {timeFormatted}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Mode</span>
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            <Video className="h-3.5 w-3.5" />
            Google Meet Video Call
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Link href="/patient/appointments">
          <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm shadow-primary/20">
            <span>View in Appointments</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          onClick={onBookAnother}
          className="w-full h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground"
        >
          Book another slot
        </Button>
      </div>
    </div>
  );
};
