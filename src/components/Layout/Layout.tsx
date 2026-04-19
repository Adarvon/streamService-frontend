import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Upload, Bell, User, Home, Radio, TrendingUp, Compass, Heart, Clock, List, Music, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Share2, Menu, X, Library } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePlayerStore } from '../../store/playerStore';
import { useUIStore } from '../../store/uiStore';
import { usePlayer } from '../../hooks/usePlayer';
import { useBreakpoint } from '../../styles/breakpoints';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const { isMobile, isTablet } = useBreakpoint();

  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    if (isMobile && sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [sidebarOpen, isMobile]);

  // Swipe to close sidebar
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchEndX.current - touchStartX.current;
    if (deltaX < -50) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        {isMobile && (
          <button className={styles.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
        )}

        <Link to="/" className={styles.logo}>
          SoundWave
        </Link>

        {!isMobile && (
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
                <Home size={18} />
                {!isTablet && 'Home'}
              </Link>
            </li>
            <li>
              <Link to="/stream" className={`${styles.navLink} ${isActive('/stream') ? styles.active : ''}`}>
                <Radio size={18} />
                {!isTablet && 'Stream'}
              </Link>
            </li>
            <li>
              <Link to="/charts" className={`${styles.navLink} ${isActive('/charts') ? styles.active : ''}`}>
                <TrendingUp size={18} />
                {!isTablet && 'Charts'}
              </Link>
            </li>
            <li>
              <Link to="/discover" className={`${styles.navLink} ${isActive('/discover') ? styles.active : ''}`}>
                <Compass size={18} />
                {!isTablet && 'Discover'}
              </Link>
            </li>
          </ul>
        )}

        {!isMobile ? (
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
        ) : (
          <button className={styles.iconBtn} onClick={() => setShowMobileSearch(true)}>
            <Search size={20} />
          </button>
        )}

        <div className={styles.navActions}>
          {!isMobile && (
            <>
              <button className={styles.uploadBtn} onClick={() => navigate('/upload')}>
                <Upload size={16} style={{ marginRight: 8 }} />
                Upload
              </button>
              <button className={styles.iconBtn}>
                <Bell size={20} />
              </button>
            </>
          )}
          {user && !isMobile ? (
            <Link to={`/profile/${user.id}`} className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className={styles.avatarImg} />
              ) : (
                <User size={20} />
              )}
            </Link>
          ) : !user && !isMobile ? (
            <Link to="/login" className={styles.uploadBtn}>
              Sign In
            </Link>
          ) : null}
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className={styles.mobileSearchOverlay}>
          <div className={styles.mobileSearchHeader}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for tracks, artists..."
              className={styles.mobileSearchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className={styles.iconBtn} onClick={() => setShowMobileSearch(false)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Overlay (Mobile) */}
      {isMobile && sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={styles.mainContainer}>
        {!isMobile && (
          <aside
            ref={sidebarRef}
            className={`${styles.sidebar} ${isTablet ? styles.sidebarCompact : ''} ${
              isMobile && sidebarOpen ? styles.sidebarOpen : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isMobile && (
              <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarLogo}>SoundWave</h2>
                <button className={styles.iconBtn} onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>
            )}

            <div className={styles.sidebarSection}>
              <ul className={styles.sidebarLinks}>
                <li>
                  <Link
                    to="/feed"
                    className={`${styles.sidebarLink} ${isActive('/feed') ? styles.active : ''}`}
                    title="Feed"
                  >
                    <Home size={20} />
                    {!isTablet && <span>Feed</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/likes"
                    className={`${styles.sidebarLink} ${isActive('/likes') ? styles.active : ''}`}
                    title="Likes"
                  >
                    <Heart size={20} />
                    {!isTablet && <span>Likes</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/history"
                    className={`${styles.sidebarLink} ${isActive('/history') ? styles.active : ''}`}
                    title="History"
                  >
                    <Clock size={20} />
                    {!isTablet && <span>History</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/playlists"
                    className={`${styles.sidebarLink} ${isActive('/playlists') ? styles.active : ''}`}
                    title="Playlists"
                  >
                    <List size={20} />
                    {!isTablet && <span>Playlists</span>}
                  </Link>
                </li>
              </ul>
            </div>

            {!isTablet && (
              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarTitle}>Following</h3>
                <ul className={styles.followingList}>
                  <li className={styles.followingItem}>
                    <div className={styles.followingAvatar}>
                      <User size={16} />
                    </div>
                    <span className={styles.followingName}>Artist Name</span>
                  </li>
                </ul>
              </div>
            )}
          </aside>
        )}

        <main className={styles.content}>{children}</main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <nav className={styles.bottomTabBar}>
          <Link to="/" className={`${styles.tabItem} ${isActive('/') ? styles.active : ''}`}>
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link to="/search" className={`${styles.tabItem} ${isActive('/search') ? styles.active : ''}`}>
            <Search size={24} />
            <span>Search</span>
          </Link>
          <Link to="/upload" className={`${styles.tabItem} ${isActive('/upload') ? styles.active : ''}`}>
            <Upload size={24} />
            <span>Upload</span>
          </Link>
          <Link to="/library" className={`${styles.tabItem} ${isActive('/library') ? styles.active : ''}`}>
            <Library size={24} />
            <span>Library</span>
          </Link>
          {user ? (
            <Link
              to={`/profile/${user.id}`}
              className={`${styles.tabItem} ${isActive(`/profile/${user.id}`) ? styles.active : ''}`}
            >
              <User size={24} />
              <span>Profile</span>
            </Link>
          ) : (
            <Link to="/login" className={styles.tabItem}>
              <User size={24} />
              <span>Login</span>
            </Link>
          )}
        </nav>
      )}

      <div className={styles.player}>
        <div className={styles.trackInfo}>
          {currentTrack ? (
            <>
              <div className={styles.trackCover}>
                {currentTrack.coverUrl ? (
                  <img src={currentTrack.coverUrl} alt={currentTrack.title} className={styles.trackCoverImg} />
                ) : (
                  <Music size={24} />
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

        <div className={styles.playerCenter}>
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
