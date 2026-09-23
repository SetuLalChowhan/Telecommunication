import 'server-only';
import { cookies } from 'next/headers';
import { ApiError } from './error';
import {
  ApiEnvelope,
  EMPTY_PAGINATION_META,
  PaginatedResult,
} from './types';

/**
 * The single canonical server-side fetch client.
 *
 * Automatically forwards the incoming request cookies so authenticated
 * server-rendered calls carry the Better Auth session, and normalizes
 * failures into `ApiError`.
 */
export type ServerFetchOptions = RequestInit & {
  revalidate?: number;
  tags?: string[];
  timeoutMs?: number;
};

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

/**
 * Serialize the current request cookies into an HTTP `Cookie` header value.
 */
export async function getSerializedCookies(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
  } catch {
    return '';
  }
}

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const { revalidate, tags, timeoutMs = 8000, ...fetchOptions } = options;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cookieHeader = await getSerializedCookies();

  const nextOptions: { revalidate?: number; tags?: string[] } = {};
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  if (tags !== undefined) nextOptions.tags = tags;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (cookieHeader && !headers.has('cookie')) {
      headers.set('cookie', cookieHeader);
    }

    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
      ...(Object.keys(nextOptions).length > 0 ? { next: nextOptions } : {}),
    });
  } catch (error) {
    throw new ApiError('Failed to reach the backend server', {
      kind: 'network',
      code: 'NETWORK_ERROR',
      details: error instanceof Error ? error.message : error,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
      code?: string;
      details?: unknown;
      requestId?: string;
    } | null;

    const rawMessage =
      body?.message ??
      `API request failed: ${response.status} ${response.statusText}`;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : rawMessage;

    throw new ApiError(message, {
      status: response.status,
      code: body?.code || `HTTP_${response.status}`,
      details: body?.details,
      requestId:
        response.headers.get('x-request-id') || body?.requestId || undefined,
    });
  }

  return response.json();
}

/**
 * Envelope-unwrapping server helpers, mirroring the browser `http` client.
 *
 * Feature server modules should use these so `{ success, data, meta }` is
trapped in exactly one place, and never forward cookies by hand —
`serverFetch` already does it.
 */
export async function serverGet<T>(
  endpoint: string,
  options?: ServerFetchOptions,
): Promise<T> {
  const json = await serverFetch<ApiEnvelope<T>>(endpoint, options);
  return json?.data !== undefined ? json.data : (json as unknown as T);
}

export async function serverGetPage<T>(
  endpoint: string,
  options?: ServerFetchOptions,
): Promise<PaginatedResult<T>> {
  const json = await serverFetch<ApiEnvelope<T[]>>(endpoint, options);
  return {
    data: json?.data ?? [],
    meta: json?.meta ?? EMPTY_PAGINATION_META,
  };
}

/**
 * Serialize a params object into a `?a=1&b=2` query string, skipping empty
 * values. Shared by every feature server fetcher so query building lives in
 * exactly one place.
 */
export function buildQueryString(params?: object): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export default serverFetch;
