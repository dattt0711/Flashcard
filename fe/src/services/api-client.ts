import { ApiResponse } from '@/types';
import { API_CONFIG, getApiUrl } from './config';

// Token storage key - must match auth-store.ts
const TOKEN_KEY = 'auth_token';

// Get stored auth token
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

// Set auth token
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove auth token
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

// HTTP error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request options type
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

// Generic API request function
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

  const url = getApiUrl(path);

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if required and token exists
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        data.message || 'An error occurred'
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request Timeout', 'Request timed out');
      }
      throw new ApiError(500, 'Network Error', error.message);
    }

    throw new ApiError(500, 'Unknown Error', 'An unknown error occurred');
  }
}

// Convenience methods
export const get = <T>(path: string, requiresAuth = true) =>
  apiRequest<T>(path, { method: 'GET', requiresAuth });

export const post = <T>(path: string, body: unknown, requiresAuth = true) =>
  apiRequest<T>(path, { method: 'POST', body, requiresAuth });

export const put = <T>(path: string, body: unknown, requiresAuth = true) =>
  apiRequest<T>(path, { method: 'PUT', body, requiresAuth });

export const del = <T>(path: string, requiresAuth = true) =>
  apiRequest<T>(path, { method: 'DELETE', requiresAuth });
