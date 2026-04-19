import { apiClient } from './client';
import { Track } from '../types';

export interface TracksQuery {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
}

export interface TracksResponse {
  tracks: Track[];
  total: number;
  page: number;
  limit: number;
}

export interface UploadTrackData {
  title: string;
  description?: string;
  genre?: string;
  audio: File;
  cover?: File;
}

export interface UpdateTrackData {
  title?: string;
  description?: string;
  genre?: string;
}

export const tracksApi = {
  getAll: async (query: TracksQuery = {}): Promise<TracksResponse> => {
    const response = await apiClient.get('/tracks', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Track> => {
    const response = await apiClient.get(`/tracks/${id}`);
    return response.data;
  },

  upload: async (data: UploadTrackData): Promise<Track> => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.genre) formData.append('genre', data.genre);
    formData.append('audio', data.audio);
    if (data.cover) formData.append('cover', data.cover);

    const response = await apiClient.post('/tracks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateTrackData): Promise<Track> => {
    const response = await apiClient.put(`/tracks/${id}`, data);
    return response.data;
  },

  incrementPlays: async (id: string): Promise<void> => {
    await apiClient.patch(`/tracks/${id}/plays`);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tracks/${id}`);
  },
};
