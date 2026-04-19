import { apiClient } from './client';
import { User } from '../types';

export const likesApi = {
  getLikes: async (trackId: string): Promise<User[]> => {
    const response = await apiClient.get(`/tracks/${trackId}/likes`);
    return response.data;
  },

  like: async (trackId: string): Promise<void> => {
    await apiClient.post(`/tracks/${trackId}/likes`);
  },

  unlike: async (trackId: string): Promise<void> => {
    await apiClient.delete(`/tracks/${trackId}/likes`);
  },
};
