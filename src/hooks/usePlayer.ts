import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { tracksApi } from '../api';

export const usePlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    play,
    pause,
    next,
    setProgress,
    setDuration,
  } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      next();
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      pause();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
    };
  }, [next, pause, setProgress, setDuration]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (currentTrack) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Play error:', error);
          pause();
        });
      }

      tracksApi.incrementPlays(currentTrack.id).catch((error) => {
        console.error('Failed to increment plays:', error);
      });
    }
  }, [currentTrack, pause]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error('Play error:', error);
        pause();
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, pause]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return {
    audioRef,
    seekTo,
  };
};
