import axios from 'axios';
import { useAuthStore } from '@stores/authStore';

// All API calls go through /api which is proxied to http://localhost:3000 in dev
// In production set VITE_API_URL to the backend origin
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — inject Bearer token ───────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — normalize errors ─────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth state and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    // Normalize NestJS error shape into a consistent message string
    const data = error.response?.data;
    const message =
      typeof data?.error === 'string'
        ? data.error
        : Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message ?? error.message ?? 'Something went wrong';

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
