export type Role = "ADMIN" | "DOCTOR" | "PATIENT";

/** The authenticated user as returned by `GET /users/me`. */
export interface CurrentUser {
  id: string;
  name: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: Role;
  phone?: string | null;
  dateOfBirth?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

/**
 * Query keys for auth. `/users/me` is the single source of truth for the current
 * user — it is not duplicated into Redux, Zustand or a React context.
 */
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};
