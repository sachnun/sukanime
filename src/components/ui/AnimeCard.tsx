'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Play, Clock } from 'lucide-react';
import { AnimeCard as AnimeCardType } from '@/types/anime';
import { getNextReleaseTime, getReleaseTimeColor } from '@/lib/schedule';

interface AnimeCardProps {
  anime: AnimeCardType;
  showEpisode?: boolean;
}

// Subscribe to time updates every minute
const subscribeToMinute = (callback: () => void) => {
  const interval = setInterval(callback, 60000);
  return () => clearInterval(interval);
};

// Get current minute timestamp
const getMinuteSnapshot = () => Math.floor(Date.now() / 60000);

// Server snapshot - always return 0
const getServerSnapshot = () => 0;

export default function AnimeCard({ anime, showEpisode = true }: AnimeCardProps) {
  // Subscribe to minute changes - will cause re-render every minute
  const minuteKey = useSyncExternalStore(
    subscribeToMinute,
    getMinuteSnapshot,
    getServerSnapshot
  );

  // Check if we're on client (minuteKey > 0 means client)
  const isClient = minuteKey > 0;

  // Only calculate on client
  const releaseInfo = isClient && anime.releaseDay 
    ? getNextReleaseTime(anime.releaseDay, anime.releaseDate) 
    : null;

  const releaseColor = getReleaseTimeColor(releaseInfo);

  return (
    <Link href={`/anime/${anime.slug}`} className="group block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-card">
        {/* Poster */}
        <Image
          src={anime.poster}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Rating Badge */}
        {anime.rating && (
          <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/70 rounded px-1.5 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">{anime.rating}</span>
          </div>
        )}

        {/* Episode Badge */}
        {showEpisode && anime.episode && (
          <div className="absolute top-2 right-2 bg-primary rounded px-1.5 py-0.5">
            <span className="text-xs font-medium">Ep {anime.episode}</span>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
        {anime.title}
      </h3>

      {/* Release info */}
      {anime.releaseDay && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${releaseInfo ? releaseColor : 'text-muted'}`}>
          {releaseInfo ? (
            <>
              <Clock className="w-3 h-3" />
              <span>{releaseInfo.text}</span>
            </>
          ) : (
            <span>{anime.releaseDay}</span>
          )}
        </p>
      )}
    </Link>
  );
}
