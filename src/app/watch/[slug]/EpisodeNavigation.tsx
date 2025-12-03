'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, List } from 'lucide-react';

interface EpisodeNavigationProps {
  prevEpisode?: string;
  nextEpisode?: string;
  animeSlug: string;
}

export default function EpisodeNavigation({ prevEpisode, nextEpisode, animeSlug }: EpisodeNavigationProps) {
  const router = useRouter();

  const goToEpisode = (slug: string) => {
    router.replace(`/watch/${slug}`);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {prevEpisode ? (
          <button
            onClick={() => goToEpisode(prevEpisode)}
            className="flex items-center gap-1 px-4 py-2 bg-card hover:bg-card-hover rounded transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>
        ) : (
          <span className="flex items-center gap-1 px-4 py-2 bg-card rounded opacity-50 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </span>
        )}

        {nextEpisode ? (
          <button
            onClick={() => goToEpisode(nextEpisode)}
            className="flex items-center gap-1 px-4 py-2 bg-card hover:bg-card-hover rounded transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="flex items-center gap-1 px-4 py-2 bg-card rounded opacity-50 cursor-not-allowed">
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/anime/${animeSlug}`}
          className="flex items-center gap-1 px-4 py-2 bg-card hover:bg-card-hover rounded transition-colors"
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline">Semua Episode</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 px-4 py-2 bg-card hover:bg-card-hover rounded transition-colors"
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
