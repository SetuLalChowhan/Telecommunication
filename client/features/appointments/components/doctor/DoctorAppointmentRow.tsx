"use client";

import React from "react";
import { Video, Check, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorScheduleItem } from "@/lib/dashboard-mock-data";

interface DoctorAppointmentRowProps {
  item: DoctorScheduleItem;
  onSelect: (item: DoctorScheduleItem) => void;
  onConfirm?: (id: string) => void;
  onComplete?: (id: string) => void;
  isConfirming?: boolean;
  isCompleting?: boolean;
}

export const DoctorAppointmentRow: React.FC<DoctorAppointmentRowProps> = ({
  item,
  onSelect,
  onConfirm,
  onComplete,
  isConfirming = false,
  isCompleting = false,
}) => {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const isConfirmed = item.status === "CONFIRMED";
  const isPending = item.status === "PENDING";
  const isCompleted = item.status === "COMPLETED";
  const isCancelled = item.status === "CANCELLED";

  return (
    <div
      onClick={() => onSelect(item)}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-xs transition-all gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <Avatar className="h-11 w-11 ring-2 ring-primary/10 shrink-0">
          <AvatarImage src={item.patientAvatar} alt={item.patientName} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {getInitials(item.patientName)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-foreground truncate">{item.patientName}</h4>
            <span className="text-xs text-muted-foreground">
              ({item.patientAge}y · {item.patientGender})
            </span>
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
              {item.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" />
              {item.time}
            </span>
            <span>•</span>
            <span className="truncate max-w-[200px]">{item.symptoms}</span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 self-end sm:self-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isConfirmed && item.meetLink && (
          <a href={item.meetLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="h-8.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-xs"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Join Meet</span>
            </Button>
          </a>
        )}

        {isPending && onConfirm && (
          <Button
            size="sm"
            disabled={isConfirming}
            onClick={() => onConfirm(item.id)}
            className="h-8.5 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs gap-1 shadow-xs"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Confirm</span>
          </Button>
        )}

        {isConfirmed && onComplete && (
          <Button
            size="sm"
            variant="outline"
            disabled={isCompleting}
            onClick={() => onComplete(item.id)}
            className="h-8.5 px-3 rounded-xl text-xs gap-1 hover:bg-muted"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>Complete</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSelect(item)}
          className="h-8.5 px-2.5 rounded-xl text-xs hover:bg-muted text-muted-foreground"
        >
          Details
        </Button>
      </div>
    </div>
  );
};
