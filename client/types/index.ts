export type Role = "ADMIN" | "DOCTOR" | "PATIENT";

export type DocumentType =
  | "LICENSE"
  | "DEGREE_CERTIFICATE"
  | "NATIONAL_ID"
  | "OTHER";

export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  phone?: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  doctorProfile?: {
    id: string;
    verified: boolean;
    slug?: string | null;
  } | null;
}

export interface Banner {
  title: string;
  desc: string;
  image: string;
  link: string;
  isActive: boolean;
  type: string;
}