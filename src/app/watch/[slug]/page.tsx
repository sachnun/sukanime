import { Suspense } from 'react';
import { getEpisodeDetail } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, List } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
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
  try {
    episode = await getEpisodeDetail(slug);
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
          animePoster=""
          episodeTitle={episode.title}
          streamingServers={episode.streamingServers}
          defaultStreamingUrl={episode.streamingUrl}
        />

        {/* Controls */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {episode.prevEpisode ? (
                <Link
                  href={`/watch/${episode.prevEpisode}`}
                  className="flex items-center gap-1 px-4 py-2 bg-card hover:bg-card-hover rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 bg-card rounded opacity-50 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </span>
              )}

              {episode.nextEpisode ? (
                <Link
                  href={`/watch/${episode.nextEpisode}`}
                  className="flex items-center gap-1 px-4 py-2 bg-card hover:bg-card-hover rounded transition-colors"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 bg-card rounded opacity-50 cursor-not-allowed">
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/anime/${episode.anime.slug}`}
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
