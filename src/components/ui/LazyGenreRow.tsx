'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AnimeRow from './AnimeRow';
import AnimeCardSkeleton from './Skeleton';
import { AnimeCard } from '@/types/anime';

interface LazyGenreRowProps {
  genre: string;
  slug: string;
}

export default function LazyGenreRow({ genre, slug }: LazyGenreRowProps) {
  const [anime, setAnime] = useState<AnimeCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadGenreAnime = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/genre/${slug}?page=1`);
      const json = await res.json();

      if (json.success && json.data) {
        setAnime(json.data.anime.slice(0, 15));
        setHasLoaded(true);
      }
    } catch (error) {
      console.error(`Failed to load genre ${slug}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded && !isLoading) {
          loadGenreAnime();
        }
      },
      { 
        threshold: 0,
        rootMargin: '200px' // Start loading 200px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, isLoading, loadGenreAnime]);

  return (
    <div ref={containerRef}>
      {isLoading && !hasLoaded && (
        <section className="py-4">
          <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold">Anime {genre}</h2>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-3 overflow-hidden">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                  <AnimeCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {hasLoaded && anime.length > 0 && (
        <AnimeRow
          title={`Anime ${genre}`}
          anime={anime}
          href={`/genre/${slug}`}
          showEpisode={false}
          fetchUrl={`/api/genre/${slug}`}
        />
      )}
      
      {/* Placeholder to maintain scroll position before load */}
      {!hasLoaded && !isLoading && (
        <div className="h-[280px]" />
      )}
    </div>
  );
}
