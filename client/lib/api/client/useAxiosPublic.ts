import axios, { AxiosInstance } from "axios";

/**
 * =============================================================================
 * useAxiosPublic
 * =============================================================================
 * Purpose:
 *   Provides an Axios client instance for unauthenticated / public API requests
 *   (e.g., public doctor listings, specialties, checking availability).
 *
 * Characteristics:
 *   - Points to process.env.NEXT_PUBLIC_API_URL (defaults to http://localhost:5000).
 *   - withCredentials: true ensures session cookies are transmitted even on public queries.
 *   - Automatically unwraps NestJS TransformInterceptor responses ({ success, data }).
 * =============================================================================
 */
export const axiosPublic: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: automatically unwrap NestJS envelope response ({ success, data })
axiosPublic.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data === "object" && "success" in data && "data" in data) {
      return data; // returns { success, statusCode, message, data, meta }
    }
    return data;
  },
  (error) => {
    // Extract error message from NestJS HttpExceptionFilter
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    const err = new Error(Array.isArray(message) ? message.join(", ") : message);
    (err as any).response = error.response;
    (err as any).statusCode = error.response?.status;
    return Promise.reject(err);
  }
);

/**
 * Hook export for React components
 */
export const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
