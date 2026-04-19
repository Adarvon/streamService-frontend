import { apiClient } from './client';
import { User } from '../types';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  avatar?: File;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const formData = new FormData();
    if (data.username) formData.append('username', data.username);
    if (data.bio) formData.append('bio', data.bio);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await apiClient.put('/auth/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/auth/me');
  },
};
