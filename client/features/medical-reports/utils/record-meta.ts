import { MedicalReport } from "../types";

type ReportFileLike = Pick<MedicalReport, "fileName">;

export type RecordCategory = "prescription" | "diagnostic";

/**
 * The API has no explicit category column, so the document type is inferred from
 * the filename. Doctor uploads are prefixed with "Prescription - " by the
 * backend (MedicalReportsService.uploadReport), and patients normally keep the
 * word in their title too.
 */
const PRESCRIPTION_PATTERN = /prescription|(?:^|[\s\-_.])rx(?:[\s\-_.]|$)/i;

export function getRecordCategory(report: ReportFileLike): RecordCategory {
  return PRESCRIPTION_PATTERN.test(report.fileName || "")
    ? "prescription"
    : "diagnostic";
}

export function isPrescription(report: ReportFileLike): boolean {
  return getRecordCategory(report) === "prescription";
}

export function getRecordCategoryLabel(report: ReportFileLike): string {
  return isPrescription(report) ? "Prescription" : "Diagnostic report";
}

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "bmp",
  "avif",
]);

export function getFileExtension(fileName?: string | null): string {
  const match = /\.[a-zA-Z0-9]+$/.exec(fileName || "");
  return match ? match[0].slice(1).toLowerCase() : "";
}

export interface RecordFileKind {
  extension: string;
  /** Human label, e.g. "PDF document" or "JPEG image". */
  label: string;
  isPdf: boolean;
  isImage: boolean;
  /** Whether the browser can render it inline. */
  canPreview: boolean;
}

export function getFileKind(fileName?: string | null): RecordFileKind {
  const extension = getFileExtension(fileName);
  const isPdf = extension === "pdf";
  const isImage = IMAGE_EXTENSIONS.has(extension);

  const imageLabel = extension === "jpg" ? "JPEG" : extension.toUpperCase();
  const label = isPdf
    ? "PDF document"
    : isImage
      ? `${imageLabel} image`
      : extension
        ? `${extension.toUpperCase()} file`
        : "Document";

  return { extension, label, isPdf, isImage, canPreview: isPdf || isImage };
}

/**
 * Dates are formatted in UTC so the server-rendered HTML and the hydrated client
 * markup always produce the same string (a local-time format would differ by a
 * day near midnight and trigger a hydration mismatch).
 */
export function formatRecordDate(value?: string | Date | null): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatBookingStatus(status?: string | null): string {
  if (!status) return "";
  const lower = status.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export interface RelatedConsultation {
  doctorName: string;
  specialty: string | null;
  designation: string | null;
  hospital: string | null;
  slotStart: string | null;
  status: string | null;
}

/**
 * Returns the consultation a document is attached to, or null when the patient
 * uploaded it themselves (no bookingId was chosen).
 */
export function getRelatedConsultation(
  report: Pick<MedicalReport, "booking">
): RelatedConsultation | null {
  const booking = report.booking;
  if (!booking) return null;

  const doctor = booking.doctor;
  const doctorName =
    doctor?.user?.name?.trim() ||
    (doctor?.designation ? "Consulting doctor" : "Doctor");

  return {
    doctorName,
    specialty: doctor?.specialties?.[0]?.specialty?.name?.trim() || null,
    designation: doctor?.designation?.trim() || null,
    hospital: doctor?.hospitalAffiliation?.trim() || null,
    slotStart: booking.slotStart || null,
    status: booking.status || null,
  };
}

/** One-line summary of the related consultation for compact rows. */
export function getConsultationSummary(report: Pick<MedicalReport, "booking">): string {
  const related = getRelatedConsultation(report);
  if (!related) return "Self-uploaded";
  const specialty = related.specialty ? ` · ${related.specialty}` : "";
  return `${related.doctorName}${specialty}`;
}
