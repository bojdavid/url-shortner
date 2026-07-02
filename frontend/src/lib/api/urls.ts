import apiClient from './client';
import type { Url, CreateUrlPayload } from '@app-types/index';

export const urlsApi = {
  getAll: async (): Promise<Url[]> => {
    const { data } = await apiClient.get<Url[]>('/urls');
    return data;
  },

  create: async (payload: CreateUrlPayload): Promise<Url> => {
    const { data } = await apiClient.post<Url>('/urls', payload);
    return data;
  },

  getStats: async (code: string): Promise<Url> => {
    const { data } = await apiClient.get<Url>(`/urls/${code}/stats`);
    return data;
  },

  remove: async (code: string): Promise<void> => {
    await apiClient.delete(`/urls/${code}`);
  },
};
