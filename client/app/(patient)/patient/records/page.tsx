"use client";

import React from "react";
import {
  FileText,
  Download,
  UploadCloud,
} from "lucide-react";
import PatientLayout from "@/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { MOCK_MEDICAL_REPORTS } from "@/lib/patient-mock-data";

export default function PatientRecordsPage() {
  return (
    <PatientLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 border-b border-border">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wider block">
              Patient Documents
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-tight">
              Medical Reports
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
              View and download your uploaded diagnostic reports and laboratory tests.
            </p>
          </div>

          <Button
            onClick={() => alert("Upload report feature: Select a PDF or Image file")}
            className="h-10 sm:h-10.5 px-4 sm:px-5 rounded-xl gap-2 text-xs sm:text-sm font-semibold shadow-xs"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload Report</span>
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {MOCK_MEDICAL_REPORTS.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    {report.fileName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Uploaded on {report.uploadedAt}
                  </p>
                  {report.doctorName && (
                    <p className="text-xs text-primary font-semibold mt-1">
                      Consultant: {report.doctorName}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-muted-foreground uppercase font-medium">
                  PDF Document
                </span>
                <Button
                  variant="outline"
                  onClick={() => alert(`Downloading ${report.fileName}...`)}
                  className="h-8.5 px-3 rounded-xl text-xs font-semibold gap-1.5 hover:border-primary hover:text-primary"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
