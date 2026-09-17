/**
 * Auth Domain & API Types
 */

export type Role = "ADMIN" | "DOCTOR" | "PATIENT";

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

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  phone?: string | null;
}

export interface ServerSessionResponse {
  user: SessionUser | null;
  session: any | null;
}

export interface LoginParams {
  email: string;
  password?: string;
  rememberMe?: boolean;
  redirectTo?: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

/**
 * Unified Auth Query Keys
 */
export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  user: () => [...authKeys.all, "user"] as const,
  roles: () => [...authKeys.all, "roles"] as const,
};
