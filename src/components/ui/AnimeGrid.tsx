import Link from 'next/link';
import Image from 'next/image';
import { AnimeCard as AnimeCardType } from '@/types/anime';
import { Star, Play } from 'lucide-react';

interface AnimeGridProps {
  anime: AnimeCardType[];
  showEpisode?: boolean;
}

export default function AnimeGrid({ anime, showEpisode = true }: AnimeGridProps) {
  if (!anime || anime.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Tidak ada anime ditemukan</p>
      </div>
    );
  }

  // Remove duplicates based on slug
  const uniqueAnime = anime.filter(
    (item, index, self) => index === self.findIndex((a) => a.slug === item.slug)
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {uniqueAnime.map((item) => (
        <Link key={item.slug} href={`/anime/${item.slug}`} className="group block">
          <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-card">
            <Image
              src={item.poster}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            {/* Rating Badge */}
            {item.rating && (
              <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/70 rounded px-1.5 py-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium">{item.rating}</span>
              </div>
            )}

            {/* Episode Badge */}
            {showEpisode && item.episode && (
              <div className="absolute top-2 right-2 bg-primary rounded px-1.5 py-0.5">
                <span className="text-xs font-medium">Ep {item.episode}</span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
          </div>

          <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {item.releaseDay && (
            <p className="text-xs text-muted mt-1">
              {item.releaseDay} {item.releaseDate && `• ${item.releaseDate}`}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
