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
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider block">
              Patient Documents
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Medical Reports
            </h1>
            <p className="text-sm sm:text-base text-secondary-text leading-relaxed">
              View and download your uploaded diagnostic reports and laboratory tests.
            </p>
          </div>

          <Button
            onClick={() => alert("Upload report feature: Select a PDF or Image file")}
            className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl gap-2.5 text-sm sm:text-base font-semibold shadow-xs"
          >
            <UploadCloud className="h-4.5 w-4.5" />
            <span>Upload Report</span>
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {MOCK_MEDICAL_REPORTS.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 space-y-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {report.fileName}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Uploaded on {report.uploadedAt}
                  </p>
                  {report.doctorName && (
                    <p className="text-xs sm:text-sm text-primary font-semibold mt-1.5">
                      Consultant: {report.doctorName}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-mono text-muted-foreground uppercase font-medium">
                  PDF Document
                </span>
                <Button
                  variant="outline"
                  onClick={() => alert(`Downloading ${report.fileName}...`)}
                  className="h-9 sm:h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold gap-1.5 hover:border-primary hover:text-primary"
                >
                  <Download className="h-4 w-4" />
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
