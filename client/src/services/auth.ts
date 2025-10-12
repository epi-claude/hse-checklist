import { api } from './api';
import { LoginResponse, RegisterResponse } from '../types/auth.types';

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },

  async register(username: string, password: string, email?: string, full_name?: string): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', {
      username,
      password,
      email,
      full_name,
    });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
