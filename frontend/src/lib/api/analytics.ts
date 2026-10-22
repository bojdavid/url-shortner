import { apiClient } from './client';

export interface ClickByDay {
  date: string;
  clicks: number;
}

export interface RefererStat {
  referer: string | null;
  clicks: number;
}

export interface AnalyticsResponse {
  code: string;
  totalClicks: number;
  period: string;
  byDay: ClickByDay[];
  byReferer: RefererStat[];
}

export const analyticsApi = {
  getAnalytics: async (code: string, days: number = 30): Promise<AnalyticsResponse> => {
    const response = await apiClient.get(`/urls/${code}/analytics`, {
      params: { days },
    });
    return response.data;
  },
};
