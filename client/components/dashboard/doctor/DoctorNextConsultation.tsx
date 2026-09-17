"use client";

import React from "react";
import { Calendar, Video, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorScheduleItem } from "@/lib/dashboard-mock-data";

interface DoctorNextConsultationProps {
  appointment?: DoctorScheduleItem;
  onMarkComplete: (id: string) => void;
}

export const DoctorNextConsultation: React.FC<DoctorNextConsultationProps> = ({
  appointment,
  onMarkComplete,
}) => {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Next Live Consultation
          </h2>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>BMDC Verified</span>
          </span>
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
        <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Patient Details */}
            <div className="flex items-start sm:items-center gap-4">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-primary/20 shrink-0">
                <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                  {appointment.patientName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-xl font-bold text-foreground">
                    {appointment.patientName}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">
                    ({appointment.patientAge}y, {appointment.patientGender})
                  </span>
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

                <p className="text-sm text-primary font-medium">
                  {appointment.consultationType} · <span className="text-secondary-text">{appointment.symptoms}</span>
                </p>

                <div className="flex items-center gap-3 text-sm text-secondary-text pt-1">
                  <span className="flex items-center gap-1.5 font-bold text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Today · {appointment.time}
                  </span>
                  <span>&bull;</span>
                  <span className="text-muted-foreground font-medium">
                    Fee: ৳{appointment.fee}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
              {appointment.meetLink && appointment.status === "CONFIRMED" && (
                <a
                  href={appointment.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-10 sm:h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold gap-2 shadow-xs">
                    <Video className="h-4 w-4" />
                    <span>Start Video Call</span>
                  </Button>
                </a>
              )}

              {appointment.status === "CONFIRMED" && (
                <Button
                  variant="outline"
                  onClick={() => onMarkComplete(appointment.id)}
                  className="h-10 sm:h-11 px-4 rounded-xl text-sm font-medium border-border hover:border-emerald-500 hover:text-emerald-600"
                >
                  <Check className="h-4 w-4" />
                  <span>Complete Visit</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2 bg-card/50">
          <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No pending consultations for today</h3>
          <p className="text-sm text-secondary-text">Your clinical schedule is clear.</p>
        </div>
      )}
    </section>
  );
};

export default DoctorNextConsultation;
