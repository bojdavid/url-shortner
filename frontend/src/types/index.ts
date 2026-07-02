// ─── Shared TypeScript types matching backend entities ───────────────────────

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Url {
  id: string;
  code: string;
  originalUrl: string;
  clicks: number;
  expiresAt: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUrlPayload {
  originalUrl: string;
  customCode?: string;
  expiresInDays?: number;
}

export interface AnalyticsDay {
  date: string;
  clicks: number;
}

export interface AnalyticsReferer {
  referer: string | null;
  clicks: number;
}

export interface AnalyticsResponse {
  code: string;
  totalClicks: number;
  period: string;
  byDay: AnalyticsDay[];
  byReferer: AnalyticsReferer[];
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp?: string;
  path?: string;
}
