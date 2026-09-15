/**
 * =============================================================================
 * Client API Architecture Gateway
 * =============================================================================
 *
 * For Client Components ("use client"):
 *   - useAxiosPublic: Axios instance for public endpoints.
 *   - useAxiosSecure: Axios instance with Better-Auth cookies and token authorization.
 *   - useClient: TanStack Query hook for GET requests.
 *   - useMutationClient: TanStack Query hook for POST/PUT/PATCH/DELETE mutations.
 *   - authClient: Better-Auth client instance (useSession, signIn, signUp, etc.).
 *   - useAuth: Primary auth hook (login, register, logout, role redirect).
 *
 * NOTE:
 *   Server-side tools (serverFetch, ssrQuery) use Node.js runtime APIs (next/headers)
 *   and MUST be imported from `@/lib/api/server` inside Server Components only!
 * =============================================================================
 */

// Client-side API (safe for browser and Client Components)
export { useAxiosPublic, axiosPublic } from "./client/useAxiosPublic";
export { useAxiosSecure, axiosSecure } from "./client/useAxiosSecure";
export { useClient } from "./client/useClient";
export { useMutationClient } from "./client/useMutationClient";
export { authClient, useSession, signIn, signUp, signOut } from "./client/authClient";
export { useAuth, getRoleDashboardRoute } from "./client/useAuth";
