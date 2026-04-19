import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Heart,
  Share2,
  Plus,
  Calendar,
  Tag,
  MessageCircle,
  User,
  Trash2,
  Edit2,
  Send,
  RefreshCw
} from 'lucide-react';
import { tracksApi, commentsApi, likesApi, usersApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { TrackCard } from '../components/TrackCard';
import { Comment } from '../types';
import styles from './Track.module.css';

export const Track = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { play, pause, currentTrack, isPlaying, addToQueue } = usePlayerStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: track, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['track', id],
    queryFn: () => tracksApi.getById(id!),
    enabled: !!id,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsApi.getByTrack(id!),
    enabled: !!id,
  });

  const { data: relatedTracks } = useQuery({
    queryKey: ['tracks', 'related', track?.genre],
    queryFn: () => tracksApi.getAll({ limit: 5, genre: track?.genre }),
    enabled: !!track?.genre,
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => commentsApi.create(id!, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setCommentText('');
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentsApi.update(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setEditingCommentId(null);
      setEditText('');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => likesApi.like(id!),
    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({ queryKey: ['track', id] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => likesApi.unlike(id!),
    onSuccess: () => {
      setIsLiked(false);
      queryClient.invalidateQueries({ queryKey: ['track', id] });
    },
  });

  const followMutation = useMutation({
    mutationFn: () => usersApi.follow(track!.userId),
    onSuccess: () => setIsFollowing(true),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => usersApi.unfollow(track!.userId),
    onSuccess: () => setIsFollowing(false),
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barCount = 200;
    const barWidth = width / barCount;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * height * 0.8 + height * 0.1;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      ctx.fillStyle = i % 2 === 0 ? '#ff5500' : '#ff7733';
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }, [track]);

  const handlePlay = () => {
    if (!track) return;
    if (currentTrack?.id === track.id) {
      isPlaying ? pause() : play();
    } else {
      addToQueue(track);
      play(track);
    }
  };

  const handleLike = () => {
    if (!user) return;
    isLiked ? unlikeMutation.mutate() : likeMutation.mutate();
  };

  const handleFollow = () => {
    if (!user || !track) return;
    isFollowing ? unfollowMutation.mutate() : followMutation.mutate();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    createCommentMutation.mutate(commentText);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editText.trim()) return;
    updateCommentMutation.mutate({ commentId, content: editText });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (isError || !track) {
    return (
      <div className={styles.error}>
        <h2>Failed to load track</h2>
        <p>{error instanceof Error ? error.message : 'Track not found'}</p>
        <button className={styles.retryBtn} onClick={() => refetch()}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const isCurrentTrack = currentTrack?.id === track.id;

  return (
    <div className={styles.trackPage}>
      <div className={styles.mainContent}>
        <section className={styles.hero}>
          <div className={styles.coverContainer}>
            {track.coverUrl ? (
              <img src={track.coverUrl} alt={track.title} className={styles.cover} />
            ) : (
              <div className={styles.coverPlaceholder}>
                <Play size={64} />
              </div>
            )}
          </div>

          <div className={styles.trackInfo}>
            <h1 className={styles.title}>{track.title}</h1>
            <Link to={`/profile/${track.userId}`} className={styles.artist}>
              {track.user?.username || 'Unknown Artist'}
            </Link>

            <div className={styles.metadata}>
              <span className={styles.metaItem}>
                <Calendar size={16} />
                {formatDate(track.createdAt)}
              </span>
              {track.genre && (
                <span className={styles.metaItem}>
                  <Tag size={16} />
                  {track.genre}
                </span>
              )}
            </div>

            {track.description && (
              <p className={styles.description}>{track.description}</p>
            )}

            <div className={styles.actions}>
              <button className={styles.playBtn} onClick={handlePlay}>
                {isCurrentTrack && isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                onClick={handleLike}
                disabled={!user}
              >
                <Heart size={20} fill={isLiked ? '#ff5500' : 'none'} />
                Like
              </button>
              <button className={styles.actionBtn}>
                <Share2 size={20} />
                Share
              </button>
              <button className={styles.actionBtn}>
                <Plus size={20} />
                Add to Playlist
              </button>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{formatNumber(track.plays)}</span>
                <span className={styles.statLabel}>Plays</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{formatNumber(track.likes)}</span>
                <span className={styles.statLabel}>Likes</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{comments?.length || 0}</span>
                <span className={styles.statLabel}>Comments</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.waveformSection}>
          <canvas ref={canvasRef} width={1000} height={120} className={styles.waveform} />
        </section>

        <section className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>
            <MessageCircle size={24} />
            Comments ({comments?.length || 0})
          </h2>

          {user ? (
            <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
              <div className={styles.commentAvatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <textarea
                className={styles.commentInput}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <button
                type="submit"
                className={styles.commentSubmit}
                disabled={!commentText.trim() || createCommentMutation.isPending}
              >
                <Send size={20} />
              </button>
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <p>Login to comment</p>
              <Link to="/login" className={styles.loginBtn}>
                Sign In
              </Link>
            </div>
          )}

          <div className={styles.commentsList}>
            {comments?.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentAvatar}>
                  {comment.user?.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.username} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <Link to={`/profile/${comment.userId}`} className={styles.commentAuthor}>
                      {comment.user?.username || 'Unknown'}
                    </Link>
                    <span className={styles.commentTime}>{formatDate(comment.createdAt)}</span>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className={styles.editForm}>
                      <textarea
                        className={styles.editInput}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                      />
                      <div className={styles.editActions}>
                        <button
                          className={styles.saveBtn}
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={updateCommentMutation.isPending}
                        >
                          Save
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={styles.commentText}>{comment.content}</p>
                      {user?.id === comment.userId && (
                        <div className={styles.commentActions}>
                          <button
                            className={styles.commentActionBtn}
                            onClick={() => handleEditComment(comment)}
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            className={styles.commentActionBtn}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className={styles.sidebar}>
        {track.user && (
          <div className={styles.artistCard}>
            <div className={styles.artistAvatar}>
              {track.user.avatar ? (
                <img src={track.user.avatar} alt={track.user.username} />
              ) : (
                <User size={32} />
              )}
            </div>
            <h3 className={styles.artistName}>{track.user.username}</h3>
            {track.user.bio && <p className={styles.artistBio}>{track.user.bio}</p>}
            {user?.id !== track.userId && (
              <button
                className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                onClick={handleFollow}
                disabled={!user}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        )}

        {relatedTracks && relatedTracks.tracks.length > 0 && (
          <div className={styles.relatedSection}>
            <h3 className={styles.sidebarTitle}>Related Tracks</h3>
            <div className={styles.relatedList}>
              {relatedTracks.tracks
                .filter((t) => t.id !== track.id)
                .slice(0, 5)
                .map((relatedTrack) => (
                  <TrackCard key={relatedTrack.id} track={relatedTrack} variant="compact" />
                ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
