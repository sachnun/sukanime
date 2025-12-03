import { Suspense } from 'react';
import { getEpisodeDetail, getAnimeDetail } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from './VideoPlayer';
import EpisodeNavigation from './EpisodeNavigation';
import DownloadSection from './DownloadSection';

interface WatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WatchPageProps) {
  const { slug } = await params;
  try {
    const episode = await getEpisodeDetail(slug);
    return {
      title: `${episode.title}`,
      description: `Nonton ${episode.title} subtitle Indonesia`,
    };
  } catch {
    return {
      title: 'Episode Not Found',
    };
  }
}

async function WatchContent({ slug }: { slug: string }) {
  let episode;
  let animePoster = '';
  
  try {
    episode = await getEpisodeDetail(slug);
    // Fetch anime detail to get poster
    try {
      const animeDetail = await getAnimeDetail(episode.anime.slug);
      animePoster = animeDetail.poster;
    } catch {
      // Poster fetch failed, continue without it
    }
  } catch {
    notFound();
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Video Player */}
        <VideoPlayer
          episodeSlug={slug}
          animeSlug={episode.anime.slug}
          animeTitle={episode.anime.title}
          animePoster={animePoster}
          episodeTitle={episode.title}
          streamingServers={episode.streamingServers}
          defaultStreamingUrl={episode.streamingUrl}
        />

        {/* Controls */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Navigation */}
          <EpisodeNavigation
            prevEpisode={episode.prevEpisode}
            nextEpisode={episode.nextEpisode}
            animeSlug={episode.anime.slug}
          />

          {/* Episode Info */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">{episode.title}</h1>
            <Link
              href={`/anime/${episode.anime.slug}`}
              className="text-muted hover:text-primary transition-colors"
            >
              {episode.anime.title}
            </Link>
          </div>

          {/* Download Links */}
          <DownloadSection downloadLinks={episode.downloadLinks || []} />
        </div>
      </div>
    </div>
  );
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { slug } = await params;
  
  return (
    <Suspense
      fallback={
        <div className="pt-16 min-h-screen bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="aspect-video bg-card skeleton" />
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="h-8 w-1/2 rounded skeleton mb-4" />
              <div className="h-6 w-1/3 rounded skeleton" />
            </div>
          </div>
        </div>
      }
    >
      <WatchContent slug={slug} />
    </Suspense>
  );
}
