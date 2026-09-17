/**
 * Core API Layer Gateway
 */

// 1. Core HTTP Clients
export { apiClient, API_BASE_URL } from "./axios";
export { serverFetch } from "./server-fetch";

// 2. Feature Re-Exports for Seamless Interop
export {
  authClient,
  authKeys,
  useAuth,
  getRoleDashboardRoute,
  useSession,
  signIn,
  signUp,
  signOut,
} from "@/features/auth";

export {
  useDoctors,
  useDoctorDetails,
  useDoctorAvailability,
  useMyDoctorProfile,
  useUpdateDoctorProfile,
  useSpecialties,
  doctorKeys,
} from "@/features/doctors";
