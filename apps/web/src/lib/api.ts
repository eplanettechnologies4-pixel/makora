const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiFetchOptions extends RequestInit {
  data?: any;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Robust API Client wrapper with HTTP-only cookie credentials and silent token refresh
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});

  if (options.data && !(options.data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.data);
  }

  // Support memory / storage token if available (cookies are primary)
  if (typeof window !== 'undefined') {
    const memoryToken = sessionStorage.getItem('makaura_access_token');
    if (memoryToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${memoryToken}`);
    }
  }

  const fetchConfig: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Primary authentication via secure HTTP-only cookies
  };

  try {
    const response = await fetch(url, fetchConfig);

    // 401 Unauthorized handling for protected routes
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      if (typeof window !== 'undefined') {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({}),
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData?.data?.accessToken) {
                sessionStorage.setItem('makaura_access_token', refreshData.data.accessToken);
              }
              processQueue(null);
              isRefreshing = false;

              // Retry original request
              return apiRequest<T>(endpoint, options);
            } else {
              processQueue(new Error('Session expired'));
              isRefreshing = false;
              sessionStorage.removeItem('makaura_access_token');
            }
          } catch (refreshErr) {
            processQueue(refreshErr);
            isRefreshing = false;
            sessionStorage.removeItem('makaura_access_token');
          }
        } else {
          // Wait for refresh to finish
          return new Promise<T>((resolve, reject) => {
            failedQueue.push({
              resolve: () => resolve(apiRequest<T>(endpoint, options)),
              reject,
            });
          });
        }
      }
    }

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        responseData?.message ||
        (Array.isArray(responseData?.message) ? responseData.message.join(', ') : null) ||
        responseData?.error?.message ||
        `HTTP Error ${response.status}: ${response.statusText}`;

      const error: any = new Error(errorMsg);
      error.status = response.status;
      error.response = responseData;
      throw error;
    }

    return responseData as T;
  } catch (error: any) {
    throw error;
  }
}
