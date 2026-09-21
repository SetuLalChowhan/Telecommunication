import 'server-only';
import { cookies } from 'next/headers';
import { env } from '../config/env';
import { ApiError } from './api-error';
import { ApiEnvelope, PaginatedResult } from './types';

export interface ServerFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  let url = `${env.NEXT_PUBLIC_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.set(k, String(v));
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const headers = new Headers(options.headers);
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: unknown) {
    throw new ApiError('Failed to reach backend server', {
      kind: 'network',
      code: 'NETWORK_ERROR',
      details: err instanceof Error ? err.message : err,
    });
  }

  let json: ApiEnvelope<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(`Unexpected response format from server (${res.status})`, {
      status: res.status,
      code: `HTTP_${res.status}`,
    });
  }

  if (!res.ok || json.success === false) {
    const reqId = res.headers.get('x-request-id') || undefined;
    throw new ApiError(json.message || `Request failed with status ${res.status}`, {
      status: res.status,
      code: (json as any).code || `HTTP_${res.status}`,
      details: (json as any).details,
      requestId: reqId,
    });
  }

  return json.data !== undefined ? json.data : (json as unknown as T);
}

export async function serverFetchPage<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<PaginatedResult<T>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  let url = `${env.NEXT_PUBLIC_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.set(k, String(v));
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const headers = new Headers(options.headers);
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: unknown) {
    throw new ApiError('Failed to reach backend server', {
      kind: 'network',
      code: 'NETWORK_ERROR',
      details: err instanceof Error ? err.message : err,
    });
  }

  const json: ApiEnvelope<T[]> = await res.json();

  if (!res.ok || json.success === false) {
    const reqId = res.headers.get('x-request-id') || undefined;
    throw new ApiError(json.message || `Request failed with status ${res.status}`, {
      status: res.status,
      code: (json as any).code || `HTTP_${res.status}`,
      details: (json as any).details,
      requestId: reqId,
    });
  }

  return {
    data: json.data || [],
    meta: json.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}
