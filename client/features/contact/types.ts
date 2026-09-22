/**
 * Contact / inquiry domain types.
 *
 * `ContactMessageInput` mirrors the backend `CreateContactMessageDto`, so a
 * payload built here validates identically on the server.
 */

export const CONTACT_MESSAGE_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "SPAM",
] as const;

export type ContactMessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];

export type ContactSource =
  | "home"
  | "about"
  | "doctors"
  | "blogs"
  | "consult"
  | "footer"
  | "contact-page";

export interface ContactMessageInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source?: ContactSource | string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string | null;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export const contactKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (status?: string) => [...contactKeys.lists(), status ?? "ALL"] as const,
  detail: (id: string) => [...contactKeys.all, "detail", id] as const,
};

/** Subjects offered in the contact form's select. */
export const CONTACT_SUBJECTS = [
  "General inquiry",
  "Appointment support",
  "Technical issue",
  "Billing & payments",
  "Doctor onboarding",
  "Partnership",
] as const;
