import { apiClient } from './client';
import { User, Track } from '../types';

export const usersApi = {
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  getTracks: async (id: string): Promise<Track[]> => {
    const response = await apiClient.get(`/users/${id}/tracks`);
    return response.data;
  },

  follow: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/follow`);
  },

  unfollow: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}/follow`);
  },

  getFollowers: async (id: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/${id}/followers`);
    return response.data;
  },

  getFollowing: async (id: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/${id}/following`);
    return response.data;
  },
};
