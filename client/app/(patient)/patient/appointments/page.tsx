"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  Plus,
} from "lucide-react";
import PatientLayout from "@/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_BOOKINGS } from "@/lib/patient-mock-data";

export default function PatientAppointmentsPage() {
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED">("ALL");

  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    if (filter === "ALL") return true;
    return booking.status === filter;
  });

  return (
    <PatientLayout>
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider block">
              Patient Consultations
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              My Bookings
            </h1>
            <p className="text-sm sm:text-base text-secondary-text leading-relaxed">
              View and manage your scheduled doctor appointments and join video calls.
            </p>
          </div>

          <Link href="/doctors">
            <Button className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm sm:text-base gap-2.5 shadow-xs">
              <Plus className="h-4.5 w-4.5" />
              <span>Book Appointment</span>
            </Button>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {(["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"] as const).map((status) => {
            const count =
              status === "ALL"
                ? MOCK_BOOKINGS.length
                : MOCK_BOOKINGS.filter((b) => b.status === status).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  filter === status
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {status === "ALL" ? "All Bookings" : status.charAt(0) + status.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-13 w-13 sm:h-15 sm:w-15 ring-2 ring-primary/20 shrink-0">
                    <AvatarImage src={booking.doctor.avatar} alt={booking.doctor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      DR
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                        {booking.doctor.name}
                      </h2>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : booking.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-primary font-semibold">
                      {booking.doctor.specialty} &bull; <span className="text-muted-foreground font-normal">Fee: {booking.doctor.fee} BDT</span>
                    </p>
                    <p className="text-xs sm:text-sm text-secondary-text font-medium">
                      {booking.slotStart}
                    </p>
                    {booking.notes && (
                      <p className="text-xs sm:text-sm text-muted-foreground italic pt-0.5">
                        Note: {booking.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                  {booking.meetLink && booking.status === "CONFIRMED" && (
                    <a
                      href={booking.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="h-10 sm:h-11 px-5 sm:px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold gap-2 shadow-xs">
                        <Video className="h-4 w-4" />
                        <span>Join Video Consultation</span>
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No bookings found</h3>
              <p className="text-sm text-muted-foreground">
                You have no appointments matching &ldquo;{filter}&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
