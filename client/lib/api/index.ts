/**
 * Core API Layer Gateway (Client-Safe Re-Exports)
 */

// 1. Core HTTP Client
export { apiClient, API_BASE_URL } from "./axios";

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
