import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/lib/config/env";
import { clearAuthToken, getAuthToken } from "@/lib/auth/token";
import { ApiError, toApiError } from "./error";
import { ApiEnvelope, EMPTY_PAGINATION_META, PaginatedResult } from "./types";

/**
 * The one and only HTTP client for the admin app.
 *
 * - Sends the Better Auth session token as a bearer header.
 * - Normalizes every failure into a single `ApiError`.
 *
 * There is deliberately no global timeout: document uploads can legitimately
 * take longer than a short default would allow.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = toApiError(error);
    // A rejected token is useless; drop it so guards send the user to /login
    // instead of looping on a stale credential.
    if (apiError.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(apiError);
  },
);

/**
 * Envelope-unwrapping helpers.
 *
 * Feature API functions use these so the `{ success, data, meta }` wrapper is
 * decoded in exactly one place. `apiClient` stays available for requests that
 * need the full response object (e.g. reading a header).
 */
export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.get<ApiEnvelope<T>>(url, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  getPage: async <T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResult<T>> => {
    const res = await apiClient.get<ApiEnvelope<T[]>>(url, config);
    return {
      data: res.data.data ?? [],
      meta: res.data.meta ?? EMPTY_PAGINATION_META,
    };
  },

  post: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.post<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  patch: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.patch<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  put: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.put<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.delete<ApiEnvelope<T>>(url, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },
};

export type { ApiError };

export default apiClient;
