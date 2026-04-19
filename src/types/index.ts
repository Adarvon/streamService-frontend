export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Track {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  coverUrl?: string;
  duration: number;
  userId: string;
  user?: User;
  plays: number;
  likes: number;
  createdAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  user?: User;
  tracks: Track[];
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  trackId: string;
  userId: string;
  user?: User;
  createdAt: string;
}

export interface Like {
  id: string;
  trackId: string;
  userId: string;
  createdAt: string;
}
