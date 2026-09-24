"use client";

import React from "react";
import { Video, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardAppointment } from "@/features/appointments/types";

interface PatientAppointmentCardProps {
  appointment: DashboardAppointment;
  onSelect: (appointment: DashboardAppointment) => void;
}

export const PatientAppointmentCard: React.FC<PatientAppointmentCardProps> = ({
  appointment,
  onSelect,
}) => {
  const isConfirmed = appointment.status === "CONFIRMED";
  const isPending = appointment.status === "PENDING";
  const isCompleted = appointment.status === "COMPLETED";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div
      onClick={() => onSelect(appointment)}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-xs transition-all gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10 shrink-0">
          <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {getInitials(appointment.doctorName)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-foreground truncate">{appointment.doctorName}</h4>
            <span className="text-xs text-muted-foreground">• {appointment.doctorSpecialty}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isConfirmed
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : isPending
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : isCompleted
                  ? "bg-muted text-muted-foreground border-border"
                  : "bg-red-500/10 text-red-600 border-red-500/20"
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Calendar className="h-3 w-3 text-primary" />
              {appointment.dateFormatted}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {appointment.timeFormatted}
            </span>
            <span>•</span>
            <span className="font-semibold text-primary">BDT {appointment.fee}</span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 self-end sm:self-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isConfirmed && appointment.meetLink && (
          <a href={appointment.meetLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="h-8.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-xs"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Join Video Call</span>
            </Button>
          </a>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelect(appointment)}
          className="h-8.5 px-3 rounded-xl text-xs hover:bg-muted"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
