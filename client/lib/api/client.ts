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
export const API_BASE_URL =
  process.env.NEXT_PRIVATE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  env.NEXT_PRIVATE_API_URL ||
  env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

/**
 * The one and only browser HTTP client.
 *
 * - Sends Better Auth session cookies cross-origin (`withCredentials`).
 * - Sends Bearer token via Authorization header from localStorage.
 * - Normalizes every failure into a single `ApiError`.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  const initialToken = localStorage.getItem('auth_token');
  if (initialToken) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
  }
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      const authToken =
        response.headers['set-auth-token'] ||
        response.data?.token ||
        response.data?.data?.token ||
        response.data?.session?.token;
      if (authToken && typeof authToken === 'string') {
        localStorage.setItem('auth_token', authToken);
        document.cookie = `auth_token=${encodeURIComponent(authToken)}; path=/; max-age=2592000; SameSite=Lax;`;
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      }
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // If unauthorized on users/me, clear invalid session tokens
      if (error.config?.url?.includes('/users/me')) {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax;';
        delete apiClient.defaults.headers.common['Authorization'];
      }
    }
    return Promise.reject(toApiError(error));
  },
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
