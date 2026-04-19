import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tracksApi, TracksQuery } from '../api';
import { TrackCard } from '../components/TrackCard';
import { Play, RefreshCw } from 'lucide-react';
import styles from './Home.module.css';

const GENRES = ['All', 'Electronic', 'Hip-hop', 'Rock', 'Pop', 'Jazz', 'Classical'];
const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'new', label: 'New' },
  { value: 'popular', label: 'Popular' },
];

export const Home = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);

  const query: TracksQuery = {
    page,
    limit: 20,
    genre: selectedGenre !== 'All' ? selectedGenre : undefined,
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['tracks', query],
    queryFn: () => tracksApi.getAll(query),
  });

  const {
    data: trendingData,
    isLoading: trendingLoading,
  } = useQuery({
    queryKey: ['tracks', 'trending'],
    queryFn: () => tracksApi.getAll({ limit: 10 }),
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data && data.tracks.length < data.total) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [data]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  if (isError) {
    return (
      <div className={styles.error}>
        <h2>Failed to load tracks</h2>
        <p>{error instanceof Error ? error.message : 'Something went wrong'}</p>
        <button className={styles.retryBtn} onClick={() => refetch()}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {trendingData && trendingData.tracks.length > 0 && (
        <section className={styles.hero}>
          <div
            className={styles.heroBackground}
            style={{
              backgroundImage: trendingData.tracks[0].coverUrl
                ? `url(${trendingData.tracks[0].coverUrl})`
                : 'none',
            }}
          />
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>Featured Track</span>
            <h1 className={styles.heroTitle}>{trendingData.tracks[0].title}</h1>
            <p className={styles.heroArtist}>{trendingData.tracks[0].user?.username}</p>
            <button className={styles.heroPlayBtn}>
              <Play size={20} fill="#fff" />
              Play Now
            </button>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Trending Tracks</h2>
        {trendingLoading ? (
          <div className={styles.horizontalScroll}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.horizontalScroll}>
            {trendingData?.tracks.map((track) => (
              <div key={track.id} className={styles.trendingCard}>
                <TrackCard track={track} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>New Releases</h2>
          <div className={styles.filters}>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.genres}>
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`${styles.genreTag} ${selectedGenre === genre ? styles.active : ''}`}
              onClick={() => handleGenreChange(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {data?.tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
            {data && data.tracks.length < data.total && (
              <div ref={observerRef} className={styles.loadMore}>
                <div className={styles.spinner} />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
