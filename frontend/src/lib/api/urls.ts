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

/** Mirrors backend `CreateUrlDto` (POST /urls). */
export interface CreateUrlDto {
  originalUrl: string;
  /** Optional custom alias. Omit (don't send "") to get a random code. */
  customCode?: string;
  /** Optional lifetime in days (integer >= 1). */
  expiresInDays?: number;
}

export const urlsApi = {
  // GET /urls
  findAll: async (): Promise<Url[]> => {
    const response = await apiClient.get('/urls');
    return response.data;
  },
  // POST /urls
  create: async (data: CreateUrlDto): Promise<Url> => {
    const response = await apiClient.post('/urls', data);
    return response.data;
  },
  // GET /urls/:code/stats
  getStats: async (code: string): Promise<Url> => {
    const response = await apiClient.get(`/urls/${encodeURIComponent(code)}/stats`);
    return response.data;
  },
  // DELETE /urls/:code
  remove: async (code: string): Promise<void> => {
    await apiClient.delete(`/urls/${encodeURIComponent(code)}`);
  },
};
