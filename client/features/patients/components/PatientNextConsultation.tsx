"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Video, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";

interface PatientNextConsultationProps {
  appointment?: DashboardAppointment | null;
  isLoading?: boolean;
  onOpenDetails: (appointment: DashboardAppointment) => void;
}

export const PatientNextConsultation: React.FC<PatientNextConsultationProps> = ({
  appointment,
  isLoading = false,
  onOpenDetails,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Next Up
          </h2>
        </div>

        <span className="text-xs text-muted-foreground font-medium">
          {appointment ? `${appointment.dateFormatted} · ${appointment.timeFormatted}` : "Scheduled Consultation"}
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-card border border-border/70 p-5 sm:p-6 shadow-xs animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-14 w-14 rounded-full bg-muted shrink-0" />
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-36 bg-muted rounded-md" />
                  <div className="h-4 w-16 bg-muted rounded-full" />
                </div>
                <div className="h-4 w-52 bg-muted/80 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
              <div className="h-9 w-28 bg-muted rounded-xl" />
              <div className="h-9 w-20 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      ) : appointment ? (
        <div className="rounded-2xl bg-card border border-border/70 p-5 sm:p-6 shadow-xs transition-all hover:border-primary/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Doctor and Schedule info */}
            <div className="flex items-center gap-4 min-w-0">
              <Avatar className="h-13 w-13 sm:h-14 sm:w-14 ring-1 ring-primary/20 shrink-0">
                <AvatarImage
                  src={appointment.doctorAvatar}
                  alt={appointment.doctorName}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {appointment.doctorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                    {appointment.doctorName}
                  </h3>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
                      appointment.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-text flex-wrap">
                  <span className="font-medium text-foreground">
                    {appointment.doctorSpecialty}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Calendar className="h-3.5 w-3.5" />
                    {appointment.dateFormatted} · {appointment.timeFormatted}
                  </span>
                  <span>&bull;</span>
                  <span className="text-muted-foreground">
                    {appointment.consultationType}
                  </span>
                </div>

                {appointment.status === "PENDING" && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Awaiting doctor confirmation &bull; Video consultation link
                    will activate once confirmed.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50 w-full lg:w-auto justify-end">
              {appointment.meetLink && appointment.status === "CONFIRMED" && (
                <a
                  href={appointment.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial"
                >
                  <Button className="w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold gap-2 shadow-xs">
                    <Video className="h-4 w-4" />
                    <span>Join Consultation</span>
                  </Button>
                </a>
              )}

              <Button
                variant="outline"
                onClick={() => onOpenDetails(appointment)}
                className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-medium border-border hover:border-primary/50"
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-2 bg-card/50">
          <Stethoscope className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-bold text-foreground">
            No upcoming consultations
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You do not have any scheduled appointments. Book a doctor when you
            need clinical guidance.
          </p>
          <Link href="/doctors" className="inline-block pt-1">
            <Button
              size="sm"
              className="h-8.5 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
            >
              <span>Find a Doctor</span>
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default PatientNextConsultation;
