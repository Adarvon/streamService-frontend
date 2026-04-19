import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User as UserIcon, Music, Users, Heart, Settings, RefreshCw } from 'lucide-react';
import { usersApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { TrackCard } from '../components/TrackCard';
import styles from './Profile.module.css';

type TabType = 'tracks' | 'playlists' | 'reposts' | 'likes';

export const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('tracks');
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: user, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id!),
    enabled: !!id,
  });

  const { data: tracks } = useQuery({
    queryKey: ['user-tracks', id],
    queryFn: () => usersApi.getTracks(id!),
    enabled: !!id && activeTab === 'tracks',
  });

  const { data: followers } = useQuery({
    queryKey: ['user-followers', id],
    queryFn: () => usersApi.getFollowers(id!),
    enabled: !!id,
  });

  const { data: following } = useQuery({
    queryKey: ['user-following', id],
    queryFn: () => usersApi.getFollowing(id!),
    enabled: !!id,
  });

  const followMutation = useMutation({
    mutationFn: () => usersApi.follow(id!),
    onSuccess: () => {
      setIsFollowing(true);
      queryClient.invalidateQueries({ queryKey: ['user-followers', id] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => usersApi.unfollow(id!),
    onSuccess: () => {
      setIsFollowing(false);
      queryClient.invalidateQueries({ queryKey: ['user-followers', id] });
    },
  });

  const handleFollow = () => {
    if (!currentUser) return;
    isFollowing ? unfollowMutation.mutate() : followMutation.mutate();
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

  if (isError || !user) {
    return (
      <div className={styles.error}>
        <h2>Failed to load profile</h2>
        <p>{error instanceof Error ? error.message : 'User not found'}</p>
        <button className={styles.retryBtn} onClick={() => refetch()}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className={styles.profile}>
      <section className={styles.header}>
        <div className={styles.avatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className={styles.avatarImg} />
          ) : (
            <UserIcon size={64} />
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.username}>{user.username}</h1>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatNumber(tracks?.length || 0)}</span>
              <span className={styles.statLabel}>Tracks</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatNumber(followers?.length || 0)}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatNumber(following?.length || 0)}</span>
              <span className={styles.statLabel}>Following</span>
            </div>
          </div>

          <div className={styles.actions}>
            {isOwnProfile ? (
              <Link to="/settings" className={styles.editBtn}>
                <Settings size={16} />
                Edit Profile
              </Link>
            ) : (
              <button
                className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                onClick={handleFollow}
                disabled={!currentUser || followMutation.isPending || unfollowMutation.isPending}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'tracks' ? styles.active : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            <Music size={18} />
            Tracks
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'playlists' ? styles.active : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            <Music size={18} />
            Playlists
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'reposts' ? styles.active : ''}`}
            onClick={() => setActiveTab('reposts')}
          >
            <Users size={18} />
            Reposts
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'likes' ? styles.active : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <Heart size={18} />
            Likes
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'tracks' && (
            <div className={styles.grid}>
              {tracks && tracks.length > 0 ? (
                tracks.map((track) => <TrackCard key={track.id} track={track} />)
              ) : (
                <div className={styles.empty}>
                  <Music size={48} />
                  <p>No tracks yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className={styles.empty}>
              <Music size={48} />
              <p>No playlists yet</p>
            </div>
          )}

          {activeTab === 'reposts' && (
            <div className={styles.empty}>
              <Users size={48} />
              <p>No reposts yet</p>
            </div>
          )}

          {activeTab === 'likes' && (
            <div className={styles.empty}>
              <Heart size={48} />
              <p>No likes yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
