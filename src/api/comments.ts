import { apiClient } from './client';
import { Comment } from '../types';

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export const commentsApi = {
  getByTrack: async (trackId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/tracks/${trackId}/comments`);
    return response.data;
  },

  create: async (trackId: string, data: CreateCommentData): Promise<Comment> => {
    const response = await apiClient.post(`/tracks/${trackId}/comments`, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCommentData): Promise<Comment> => {
    const response = await apiClient.put(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/comments/${id}`);
  },
};
