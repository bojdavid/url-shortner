import { apiClient } from './client';

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

export interface CreateUrlDto {
  originalUrl: string;
}

export const urlsApi = {
  findAll: async (): Promise<Url[]> => {
    const response = await apiClient.get('/urls');
    return response.data;
  },
  create: async (data: CreateUrlDto): Promise<Url> => {
    const response = await apiClient.post('/urls', data);
    return response.data;
  },
  remove: async (code: string): Promise<void> => {
    await apiClient.delete(`/urls/${code}`);
  },
};
