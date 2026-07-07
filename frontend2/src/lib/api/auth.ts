import { apiClient } from './client';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterDto) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  logout: async () => {
    // Some backends have a logout endpoint to clear the cookie
    const response = await apiClient.post('/auth/logout').catch(() => {});
    return response;
  },
};
