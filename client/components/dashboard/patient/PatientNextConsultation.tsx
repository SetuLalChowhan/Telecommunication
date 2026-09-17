"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Video, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";

interface PatientNextConsultationProps {
  appointment?: DashboardAppointment;
  onOpenDetails: (appointment: DashboardAppointment) => void;
}

export const PatientNextConsultation: React.FC<PatientNextConsultationProps> = ({
  appointment,
  onOpenDetails,
}) => {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Upcoming Consultation
          </h2>
          {appointment?.isToday && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
              <span>Today</span>
            </span>
          )}
        </div>

        <span className="text-xs sm:text-sm text-secondary-text font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {appointment ? (
        <div className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Doctor and Schedule info */}
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20 shrink-0">
                <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                  {appointment.doctorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                    {appointment.doctorName}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase ${
                      appointment.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-primary font-medium truncate">
                  {appointment.doctorSpecialty}
                  {appointment.doctorHospital && (
                    <span className="text-secondary-text"> · {appointment.doctorHospital}</span>
                  )}
                </p>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-secondary-text pt-0.5">
                  <span className="flex items-center gap-1.5 font-bold text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {appointment.dateFormatted} · {appointment.timeFormatted}
                  </span>
                  <span>&bull;</span>
                  <span className="text-muted-foreground font-medium">{appointment.consultationType}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenDetails(appointment)}
                className="h-10 px-4 rounded-xl text-xs sm:text-sm font-medium border-border hover:border-primary/50"
              >
                View Details
              </Button>

              {appointment.meetLink && appointment.status === "CONFIRMED" && (
                <a
                  href={appointment.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold gap-2 shadow-xs">
                    <Video className="h-4 w-4" />
                    <span>Join Consultation</span>
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-7 text-center space-y-3">
          <div className="h-11 w-11 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">No upcoming consultations</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You do not have any scheduled appointments for today. Book a doctor when you need clinical guidance.
            </p>
          </div>
          <Link href="/doctors" className="inline-block pt-1">
            <Button size="sm" className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5">
              <span>Find a Doctor</span>
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default PatientNextConsultation;
