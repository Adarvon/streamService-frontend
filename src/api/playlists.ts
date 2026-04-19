import { apiClient } from './client';
import { Playlist } from '../types';

export interface CreatePlaylistData {
  title: string;
  description?: string;
}

export interface UpdatePlaylistData {
  title?: string;
  description?: string;
}

export const playlistsApi = {
  getAll: async (): Promise<Playlist[]> => {
    const response = await apiClient.get('/playlists');
    return response.data;
  },

  create: async (data: CreatePlaylistData): Promise<Playlist> => {
    const response = await apiClient.post('/playlists', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePlaylistData): Promise<Playlist> => {
    const response = await apiClient.put(`/playlists/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/playlists/${id}`);
  },

  addTrack: async (id: string, trackId: string): Promise<Playlist> => {
    const response = await apiClient.post(`/playlists/${id}/tracks`, { trackId });
    return response.data;
  },

  removeTrack: async (id: string, trackId: string): Promise<void> => {
    await apiClient.delete(`/playlists/${id}/tracks/${trackId}`);
  },
};
