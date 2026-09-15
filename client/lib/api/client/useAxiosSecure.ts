import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { store } from "@/redux/store";
import { clearAuth } from "@/redux/slices/authSlice";

/**
 * =============================================================================
 * useAxiosSecure
 * =============================================================================
 * Purpose:
 *   Provides an Axios instance for authenticated / private API requests
 *   (e.g., /users/me, /doctors/me/documents, booking appointments).
 *
 * Characteristics:
 *   - withCredentials: true ensures Better-Auth session cookies (better-auth.session_token)
 *     are sent with every cross-origin request.
 *   - Request Interceptor: checks Redux store & localStorage for optional Bearer token
 *     and attaches Authorization header.
 *   - Response Interceptor: unwraps NestJS data envelopes and handles 401 Unauthorized.
 * =============================================================================
 */
export const axiosSecure: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token if present in Redux or localStorage
axiosSecure.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Check Redux store
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // 2. Check localStorage
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unpack data & format errors
axiosSecure.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data === "object" && "success" in data && "data" in data) {
      return data;
    }
    return data;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearAuth());
    }

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
export const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
