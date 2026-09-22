"use client";

import React, { useState } from "react";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorQualification } from "@/features/doctors/types";

interface DoctorQualificationsManagerProps {
  qualifications: DoctorQualification[];
  onChange: (qualifications: DoctorQualification[]) => void;
  disabled?: boolean;
}

export const DoctorQualificationsManager: React.FC<DoctorQualificationsManagerProps> = ({
  qualifications,
  onChange,
  disabled = false,
}) => {
  const [degree, setDegree] = useState("");
  const [institute, setInstitute] = useState("");
  const [passingYear, setPassingYear] = useState("");

  const handleAdd = () => {
    if (!degree.trim() || !institute.trim()) return;
    const newQual: DoctorQualification = {
      degree: degree.trim(),
      institute: institute.trim(),
      passingYear: passingYear ? parseInt(passingYear, 10) : undefined,
    };
    onChange([...qualifications, newQual]);
    setDegree("");
    setInstitute("");
    setPassingYear("");
  };

  const handleRemove = (index: number) => {
    onChange(qualifications.filter((_, i) => i !== index));
  };

  return (
    <div className="panel space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">Degrees &amp; qualifications</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Degree (e.g. MBBS, FCPS)"
          value={degree}
          disabled={disabled}
          onChange={(e) => setDegree(e.target.value)}
          className="rounded-xl h-10 text-sm"
        />
        <Input
          placeholder="Institute (e.g. Dhaka Medical College)"
          value={institute}
          disabled={disabled}
          onChange={(e) => setInstitute(e.target.value)}
          className="rounded-xl h-10 text-sm"
        />
        <div className="flex gap-2">
          <Input
            placeholder="Passing Year"
            type="number"
            value={passingYear}
            disabled={disabled}
            onChange={(e) => setPassingYear(e.target.value)}
            className="rounded-xl h-10 text-sm"
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={disabled || !degree.trim() || !institute.trim()}
            className="h-10 px-4 rounded-xl gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {qualifications.length > 0 && (
        <div className="space-y-2 pt-2">
          {qualifications.map((q, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-foreground">{q.degree}</span>
                <span className="text-muted-foreground truncate">— {q.institute}</span>
                {q.passingYear && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                    {q.passingYear}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => handleRemove(idx)}
                className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
