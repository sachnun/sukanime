import { Suspense } from 'react';
import { getAnimeDetail } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Calendar, Clock, Film, Building2, Users } from 'lucide-react';
import BookmarkButton from './BookmarkButton';
import { AnimeGridSkeleton } from '@/components/ui/Skeleton';

interface AnimePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AnimePageProps) {
  const { slug } = await params;
  try {
    const anime = await getAnimeDetail(slug);
    return {
      title: `${anime.title}`,
      description: anime.synopsis?.slice(0, 160),
    };
  } catch {
    return {
      title: 'Anime Not Found',
    };
  }
}

async function AnimeDetailContent({ slug }: { slug: string }) {
  let anime;
  try {
    anime = await getAnimeDetail(slug);
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Hero Section - Full bleed to top */}
      <div className="relative min-h-[70vh]">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={anime.poster}
            alt={anime.title}
            fill
            className="object-cover scale-110 blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src={anime.poster}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {anime.title}
              </h1>
              <p className="text-muted mb-4">{anime.japanese}</p>

              {/* Meta */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                {anime.score && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{anime.score}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted">
                  <Film className="w-4 h-4" />
                  <span>{anime.type}</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <Clock className="w-4 h-4" />
                  <span>{anime.duration}</span>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  anime.status === 'Ongoing' ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                  {anime.status}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {anime.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/genre/${genre.toLowerCase()}`}
                    className="px-3 py-1 bg-card hover:bg-card-hover rounded-full text-sm transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                {anime.episodes.length > 0 && (
                  <Link
                    href={`/watch/${anime.episodes[anime.episodes.length - 1].slug}`}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded font-semibold transition-colors"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Tonton Sekarang
                  </Link>
                )}
                <BookmarkButton
                  slug={slug}
                  title={anime.title}
                  poster={anime.poster}
                />
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-muted flex-shrink-0">Studio:</span>
                  <span className="truncate">{anime.studio}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-muted flex-shrink-0">Rilis:</span>
                  <span className="truncate">{anime.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-muted flex-shrink-0">Episode:</span>
                  <span>{anime.totalEpisode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-muted flex-shrink-0">Produser:</span>
                  <span className="truncate">{anime.producer}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis & Episodes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Synopsis */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
          <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
        </section>

        {/* Episodes */}
        {anime.episodes.length > 0 && (
          <section id="episodes" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4">
              Daftar Episode ({anime.episodes.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {anime.episodes.map((ep) => (
                <Link
                  key={ep.slug}
                  href={`/watch/${ep.slug}`}
                  className="bg-card hover:bg-card-hover rounded-lg p-4 text-center transition-colors group"
                >
                  <div className="text-lg font-semibold group-hover:text-primary transition-colors">
                    Episode {ep.episode}
                  </div>
                  <div className="text-xs text-muted mt-1">{ep.date}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Batch Downloads */}
        {anime.batch && anime.batch.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Batch Download</h2>
            <div className="space-y-4">
              {anime.batch.map((batch) => (
                <div key={batch.resolution} className="bg-card rounded-lg p-4">
                  <h3 className="font-semibold mb-3">{batch.resolution}</h3>
                  <div className="flex flex-wrap gap-2">
                    {batch.links.map((link) => (
                      <a
                        key={link.provider}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-secondary hover:bg-muted rounded text-sm transition-colors"
                      >
                        {link.provider}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default async function AnimePage({ params }: AnimePageProps) {
  const { slug } = await params;
  
  return (
    <Suspense
      fallback={
        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimeGridSkeleton count={12} />
        </div>
      }
    >
      <AnimeDetailContent slug={slug} />
    </Suspense>
  );
}
