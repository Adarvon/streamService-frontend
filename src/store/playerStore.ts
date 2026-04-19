import { create } from 'zustand';
import { Track } from '../types';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  setCurrentTrack: (track: Track | null) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  queue: [],

  play: (track) => {
    if (track) {
      set({ currentTrack: track, isPlaying: true, progress: 0 });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => set({ isPlaying: false }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  next: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    const nextTrack = queue[currentIndex + 1] || queue[0];
    set({ currentTrack: nextTrack, isPlaying: true, progress: 0 });
  },

  prev: () => {
    const { queue, currentTrack, progress } = get();
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    if (queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    const prevTrack = queue[currentIndex - 1] || queue[queue.length - 1];
    set({ currentTrack: prevTrack, isPlaying: true, progress: 0 });
  },

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  seek: (time) => set({ progress: time }),

  setProgress: (progress) => set({ progress }),

  setDuration: (duration) => set({ duration }),

  addToQueue: (track) => {
    const { queue } = get();
    if (!queue.find((t) => t.id === track.id)) {
      set({ queue: [...queue, track] });
    }
  },

  removeFromQueue: (trackId) => {
    set((state) => ({
      queue: state.queue.filter((t) => t.id !== trackId),
    }));
  },

  clearQueue: () => set({ queue: [], currentTrack: null, isPlaying: false }),

  setCurrentTrack: (track) => set({ currentTrack: track }),
}));
