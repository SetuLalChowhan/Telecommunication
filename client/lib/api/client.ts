import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config/env';
import { toApiError } from './error';
import {
  ApiEnvelope,
  EMPTY_PAGINATION_META,
  PaginatedResult,
} from './types';

/**
 * The single canonical API base URL for browser requests.
 */
export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

/**
 * The one and only browser HTTP client.
 *
 * - Sends Better Auth session cookies cross-origin (`withCredentials`).
 * - Normalizes every failure into a single `ApiError`.
 *
 * No global timeout is set on purpose: multipart uploads (documents, reports)
 * can legitimately take longer than a short default would allow.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(toApiError(error)),
);

/**
 * Envelope-unwrapping helpers.
 *
 * Prefer these inside feature API functions so a `{ success, data, meta }`
 * response is decoded in exactly one place. `apiClient` stays available for
 * raw requests that need full control over the response object.
 */
export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.get<ApiEnvelope<T>>(url, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  getPage: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResult<T>> => {
    const res = await apiClient.get<ApiEnvelope<T[]>>(url, config);
    return {
      data: res.data.data || [],
      meta: res.data.meta || EMPTY_PAGINATION_META,
    };
  },

  post: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await apiClient.post<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  patch: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await apiClient.patch<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  put: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await apiClient.put<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.delete<ApiEnvelope<T>>(url, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },
};

export default apiClient;
