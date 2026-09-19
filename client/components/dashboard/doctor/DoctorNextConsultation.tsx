"use client";

import React from "react";
import { Calendar, Video, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorScheduleItem } from "@/lib/dashboard-mock-data";
interface DoctorNextConsultationProps {
  appointment?: DoctorScheduleItem;
  onMarkComplete: (id: string) => void;
  onConfirm?: (id: string) => void;
}

export const DoctorNextConsultation: React.FC<DoctorNextConsultationProps> = ({
  appointment,
  onMarkComplete,
  onConfirm,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Next Up
          </h2>
        </div>

        <span className="text-xs text-muted-foreground font-medium">
          {appointment ? `Today · ${appointment.time}` : "Scheduled Session"}
        </span>
      </div>

      {appointment ? (
        <div className="rounded-2xl bg-card border border-border/70 p-5 sm:p-6 shadow-xs transition-all hover:border-primary/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Patient Info */}
            <div className="flex items-center gap-4 min-w-0">
              <Avatar className="h-13 w-13 sm:h-14 sm:w-14 ring-1 ring-primary/20 shrink-0">
                <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {appointment.patientName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {appointment.patientName}
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {appointment.patientAge}y · {appointment.patientGender}
                  </span>
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
                  <span className="font-medium text-foreground">{appointment.consultationType}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Calendar className="h-3.5 w-3.5" />
                    {appointment.time}
                  </span>
                  <span>&bull;</span>
                  <span className="text-muted-foreground">Fee: ৳{appointment.fee}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50 w-full lg:w-auto justify-end">
              {appointment.status === "PENDING" && onConfirm && (
                <Button
                  onClick={() => onConfirm(appointment.id)}
                  className="w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold gap-2 shadow-xs cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Confirm Appointment</span>
                </Button>
              )}

              {appointment.meetLink && appointment.status === "CONFIRMED" && (
                <a
                  href={appointment.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial"
                >
                  <Button className="w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold gap-2 shadow-xs">
                    <Video className="h-4 w-4" />
                    <span>Start Video Call</span>
                  </Button>
                </a>
              )}

              {appointment.status === "CONFIRMED" && (
                <Button
                  variant="outline"
                  onClick={() => onMarkComplete(appointment.id)}
                  className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-medium border-border hover:border-emerald-500 hover:text-emerald-600"
                >
                  <Check className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span>Complete</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-1.5 bg-card/50">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-bold text-foreground">No pending consultations</h3>
          <p className="text-xs text-secondary-text">Your clinical schedule is clear for today.</p>
        </div>
      )}
    </section>
  );
};

export default DoctorNextConsultation;
