import axios, { AxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { toApiError } from './api-error';
import { ApiEnvelope, PaginatedResult } from './types';

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15_000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);

export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.get<ApiEnvelope<T>>(url, config);
    // Unwraps { success, data } envelope in one canonical place
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  getPage: async <T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResult<T>> => {
    const res = await axiosInstance.get<ApiEnvelope<T[]>>(url, config);
    return {
      data: res.data.data || [],
      meta: res.data.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },

  post: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.post<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  patch: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.patch<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  put: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.put<ApiEnvelope<T>>(url, body, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.delete<ApiEnvelope<T>>(url, config);
    return res.data?.data !== undefined ? res.data.data : (res.data as unknown as T);
  },
};
