import { ReactNode, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Upload, Bell, User, Home, Radio, TrendingUp, Compass, Heart, Clock, List, Music, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Share2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePlayerStore } from '../../store/playerStore';
import { useUIStore } from '../../store/uiStore';
import { usePlayer } from '../../hooks/usePlayer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { openModal } = useUIStore();
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    queue,
    togglePlay,
    next,
    prev,
    setVolume,
  } = usePlayerStore();
  const { seekTo } = usePlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          SoundWave
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/stream" className={`${styles.navLink} ${isActive('/stream') ? styles.active : ''}`}>
              Stream
            </Link>
          </li>
          <li>
            <Link to="/charts" className={`${styles.navLink} ${isActive('/charts') ? styles.active : ''}`}>
              Charts
            </Link>
          </li>
          <li>
            <Link to="/discover" className={`${styles.navLink} ${isActive('/discover') ? styles.active : ''}`}>
              Discover
            </Link>
          </li>
        </ul>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search for tracks, artists..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.navActions}>
          <button className={styles.uploadBtn} onClick={() => openModal('upload')}>
            <Upload size={16} style={{ marginRight: 8 }} />
            Upload
          </button>
          <button className={styles.iconBtn}>
            <Bell size={20} />
          </button>
          {user ? (
            <Link to={`/profile/${user.id}`} className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className={styles.avatarImg} />
              ) : (
                <User size={20} />
              )}
            </Link>
          ) : (
            <Link to="/login" className={styles.uploadBtn}>
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <div className={styles.mainContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <ul className={styles.sidebarLinks}>
              <li>
                <Link to="/feed" className={`${styles.sidebarLink} ${isActive('/feed') ? styles.active : ''}`}>
                  <Home size={20} />
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/likes" className={`${styles.sidebarLink} ${isActive('/likes') ? styles.active : ''}`}>
                  <Heart size={20} />
                  Likes
                </Link>
              </li>
              <li>
                <Link to="/history" className={`${styles.sidebarLink} ${isActive('/history') ? styles.active : ''}`}>
                  <Clock size={20} />
                  History
                </Link>
              </li>
              <li>
                <Link to="/playlists" className={`${styles.sidebarLink} ${isActive('/playlists') ? styles.active : ''}`}>
                  <List size={20} />
                  Playlists
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Following</h3>
            <ul className={styles.followingList}>
              {/* Placeholder for following users */}
              <li className={styles.followingItem}>
                <div className={styles.followingAvatar}>
                  <User size={16} />
                </div>
                <span className={styles.followingName}>Artist Name</span>
              </li>
            </ul>
          </div>
        </aside>

        <main className={styles.content}>{children}</main>
      </div>

      <div className={styles.player}>
        <div className={styles.trackInfo}>
          {currentTrack ? (
            <>
              <div className={styles.trackCover}>
                {currentTrack.coverUrl ? (
                  <img src={currentTrack.coverUrl} alt={currentTrack.title} className={styles.trackCoverImg} />
                ) : (
                  <Music size={24} style={{ margin: 'auto' }} />
                )}
              </div>
              <div className={styles.trackDetails}>
                <h4 className={styles.trackTitle}>{currentTrack.title}</h4>
                <p className={styles.trackArtist}>{currentTrack.user?.username || 'Unknown Artist'}</p>
              </div>
            </>
          ) : (
            <>
              <div className={styles.trackCover} />
              <div className={styles.trackDetails}>
                <h4 className={styles.trackTitle}>No track playing</h4>
                <p className={styles.trackArtist}>Select a track to play</p>
              </div>
            </>
          )}
        </div>

        <div className={styles.playerControls}>
          <div className={styles.controlButtons}>
            <button className={styles.controlBtn} onClick={prev} disabled={queue.length === 0}>
              <SkipBack size={20} />
            </button>
            <button className={`${styles.controlBtn} ${styles.playBtn}`} onClick={togglePlay} disabled={!currentTrack}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className={styles.controlBtn} onClick={next} disabled={queue.length === 0}>
              <SkipForward size={20} />
            </button>
          </div>

          <div className={styles.progressContainer}>
            <span className={styles.timeLabel}>{formatTime(progress)}</span>
            <div className={styles.progressBar} ref={progressBarRef} onClick={handleProgressClick}>
              <div
                className={styles.progressFill}
                style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
              />
            </div>
            <span className={styles.timeLabel}>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.playerActions}>
          <button className={styles.iconBtn}>
            <Heart size={20} />
          </button>
          <div className={styles.volumeContainer}>
            <button className={styles.iconBtn} onClick={() => setVolume(volume > 0 ? 0 : 0.7)}>
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className={styles.volumeSlider} ref={volumeBarRef} onClick={handleVolumeClick}>
              <div className={styles.volumeFill} style={{ width: `${volume * 100}%` }} />
            </div>
          </div>
          <button className={styles.iconBtn}>
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
