import { api } from './api';
import { LoginResponse, RegisterResponse } from '../types/auth.types';

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },

  async register(username: string, password: string, email?: string, full_name?: string, organization?: string): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', {
      username,
      password,
      email,
      full_name,
      organization,
    });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async getCurrentUser(): Promise<LoginResponse> {
    const response = await api.get<LoginResponse>('/auth/me');
    return response.data;
  },

  async updateProfile(email?: string, full_name?: string, organization?: string) {
    const response = await api.put('/auth/profile', { email, full_name, organization });
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
