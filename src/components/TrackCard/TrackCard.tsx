import { useState } from 'react';
import { Play, Heart, MessageCircle, MoreVertical, Plus } from 'lucide-react';
import { Track } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likesApi } from '../../api';
import styles from './TrackCard.module.css';

interface TrackCardProps {
  track: Track;
  variant?: 'default' | 'compact';
}

export const TrackCard = ({ track, variant = 'default' }: TrackCardProps) => {
  const queryClient = useQueryClient();
  const { play, addToQueue, currentTrack } = usePlayerStore();
  const [isLiked, setIsLiked] = useState(false);

  const likeMutation = useMutation({
    mutationFn: () => likesApi.like(track.id),
    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => likesApi.unlike(track.id),
    onSuccess: () => {
      setIsLiked(false);
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    },
  });

  const handlePlay = () => {
    addToQueue(track);
    play(track);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
    return plays.toString();
  };

  const isPlaying = currentTrack?.id === track.id;

  return (
    <div className={`${styles.card} ${variant === 'compact' ? styles.compact : ''}`}>
      <div className={styles.coverContainer}>
        {track.coverUrl ? (
          <img src={track.coverUrl} alt={track.title} className={styles.cover} />
        ) : (
          <div className={styles.coverPlaceholder}>
            <Play size={32} />
          </div>
        )}
        <div className={styles.playOverlay}>
          <button className={styles.playBtn} onClick={handlePlay}>
            <Play size={24} fill="#fff" />
          </button>
        </div>
        {isPlaying && <div className={styles.playingIndicator}>Playing</div>}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.info}>
            <h3 className={styles.title}>{track.title}</h3>
            <p className={styles.artist}>{track.user?.username || 'Unknown Artist'}</p>
          </div>
          <span className={styles.duration}>{formatDuration(track.duration)}</span>
        </div>

        <div className={styles.stats}>
          <span className={styles.stat}>
            <Play size={14} />
            {formatPlays(track.plays)}
          </span>
          <span className={styles.stat}>
            <Heart size={14} />
            {formatPlays(track.likes)}
          </span>
          <span className={styles.stat}>
            <MessageCircle size={14} />
            {track.comments || 0}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
          >
            <Heart size={16} fill={isLiked ? '#ff5500' : 'none'} />
          </button>
          <button className={styles.actionBtn}>
            <Plus size={16} />
          </button>
          <button className={styles.actionBtn}>
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
