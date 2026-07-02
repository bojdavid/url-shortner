import apiClient from './client';
import type { AnalyticsResponse } from '@app-types/index';

export const analyticsApi = {
  getAnalytics: async (code: string, days = 30): Promise<AnalyticsResponse> => {
    const { data } = await apiClient.get<AnalyticsResponse>(
      `/urls/${code}/analytics`,
      { params: { days } }
    );
    return data;
  },
};
