"use client";

import React, { useState } from "react";
import { GraduationCap, Plus, Trash2, Pencil, Check, X } from "lucide-react";
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

  // Edit State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDegree, setEditDegree] = useState("");
  const [editInstitute, setEditInstitute] = useState("");
  const [editPassingYear, setEditPassingYear] = useState("");

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

  const handleStartEdit = (index: number) => {
    const q = qualifications[index];
    if (!q) return;
    setEditingIndex(index);
    setEditDegree(q.degree);
    setEditInstitute(q.institute);
    setEditPassingYear(q.passingYear ? String(q.passingYear) : "");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditDegree("");
    setEditInstitute("");
    setEditPassingYear("");
  };

  const handleSaveEdit = (index: number) => {
    if (!editDegree.trim() || !editInstitute.trim()) return;
    const updated = qualifications.map((q, i) => {
      if (i !== index) return q;
      return {
        ...q,
        degree: editDegree.trim(),
        institute: editInstitute.trim(),
        passingYear: editPassingYear ? parseInt(editPassingYear, 10) : undefined,
      };
    });
    onChange(updated);
    handleCancelEdit();
  };

  const handleRemove = (index: number) => {
    if (editingIndex === index) {
      handleCancelEdit();
    }
    onChange(qualifications.filter((_, i) => i !== index));
  };

  return (
    <div className="panel space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Degrees &amp; qualifications</h4>
          <p className="text-xs text-muted-foreground">Add and manage your educational degrees and medical certifications.</p>
        </div>
      </div>

      {/* Add new qualification form */}
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
            className="h-10 px-4 rounded-xl gap-1 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {/* Qualifications List */}
      {qualifications.length > 0 && (
        <div className="space-y-2 pt-2">
          {qualifications.map((q, idx) => {
            const isEditing = editingIndex === idx;

            if (isEditing) {
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-muted/60 border border-primary/30 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Edit Qualification #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        disabled={disabled || !editDegree.trim() || !editInstitute.trim()}
                        onClick={() => handleSaveEdit(idx)}
                        className="h-7 px-2.5 text-xs rounded-lg gap-1 bg-primary text-white"
                      >
                        <Check className="h-3 w-3" />
                        <span>Save</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled}
                        onClick={handleCancelEdit}
                        className="h-7 px-2 text-xs rounded-lg text-muted-foreground"
                      >
                        <X className="h-3 w-3" />
                        <span>Cancel</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <Input
                      placeholder="Degree"
                      value={editDegree}
                      disabled={disabled}
                      onChange={(e) => setEditDegree(e.target.value)}
                      className="rounded-lg h-8.5 text-xs bg-background"
                    />
                    <Input
                      placeholder="Institute"
                      value={editInstitute}
                      disabled={disabled}
                      onChange={(e) => setEditInstitute(e.target.value)}
                      className="rounded-lg h-8.5 text-xs bg-background"
                    />
                    <Input
                      placeholder="Passing Year"
                      type="number"
                      value={editPassingYear}
                      disabled={disabled}
                      onChange={(e) => setEditPassingYear(e.target.value)}
                      className="rounded-lg h-8.5 text-xs bg-background"
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 text-sm hover:border-border transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-foreground">{q.degree}</span>
                  <span className="text-muted-foreground truncate">— {q.institute}</span>
                  {q.passingYear && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium shrink-0">
                      {q.passingYear}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => handleStartEdit(idx)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                    title="Edit qualification"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => handleRemove(idx)}
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                    title="Delete qualification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
