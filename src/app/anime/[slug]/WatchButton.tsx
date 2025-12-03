'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { getLastWatchedEpisode } from '@/lib/storage';

interface WatchButtonProps {
  animeSlug: string;
  firstEpisodeSlug: string;
}

export default function WatchButton({ animeSlug, firstEpisodeSlug }: WatchButtonProps) {
  const [continueEpisode, setContinueEpisode] = useState<{
    slug: string;
    episodeNumber: string;
  } | null>(null);

  useEffect(() => {
    const lastWatched = getLastWatchedEpisode(animeSlug);
    if (lastWatched) {
      setContinueEpisode({
        slug: lastWatched.episodeSlug,
        episodeNumber: lastWatched.episodeNumber,
      });
    }
  }, [animeSlug]);

  const href = continueEpisode ? `/watch/${continueEpisode.slug}` : `/watch/${firstEpisodeSlug}`;
  const label = continueEpisode 
    ? `Lanjutkan Ep. ${continueEpisode.episodeNumber}` 
    : 'Tonton Sekarang';

  return (
    <Link
      href={href}
      className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded font-semibold transition-colors"
    >
      <Play className="w-5 h-5 fill-white" />
      {label}
    </Link>
  );
}
