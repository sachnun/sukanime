'use client';

import { useEffect, useRef, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import Link from 'next/link';
import Image from 'next/image';
import { AnimeCard as AnimeCardType, Pagination } from '@/types/anime';
import { Star, Play } from 'lucide-react';
import AnimeCardSkeleton from './Skeleton';

interface InfiniteAnimeGridProps {
  initialAnime: AnimeCardType[];
  initialPagination: Pagination;
  fetchUrl: string;
  showEpisode?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    anime: AnimeCardType[];
    pagination: Pagination;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InfiniteAnimeGrid({
  initialAnime,
  initialPagination,
  fetchUrl,
  showEpisode = true,
}: InfiniteAnimeGridProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  // SWR Infinite untuk handle pagination
  const getKey = (pageIndex: number, previousPageData: ApiResponse | null) => {
    // Sudah sampai akhir
    if (previousPageData && !previousPageData.data?.pagination?.hasNextPage) {
      return null;
    }
    // Page pertama
    if (pageIndex === 0) return `${fetchUrl}?page=1`;
    // Page selanjutnya
    return `${fetchUrl}?page=${pageIndex + 1}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite<ApiResponse>(
    getKey,
    fetcher,
    {
      fallbackData: [
        {
          success: true,
          data: {
            anime: initialAnime,
            pagination: initialPagination,
          },
        },
      ],
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Gabungkan semua anime dari semua pages
  const allAnime = data?.flatMap((page) => page.data?.anime ?? []) ?? [];
  
  // Remove duplicates based on slug
  const uniqueAnime = allAnime.filter(
    (item, index, self) => index === self.findIndex((a) => a.slug === item.slug)
  );

  // Cek apakah masih ada page selanjutnya
  const lastPage = data?.[data.length - 1];
  const hasNextPage = lastPage?.data?.pagination?.hasNextPage ?? false;
  const isLoading = isValidating;

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage) {
      setSize(size + 1);
    }
  }, [isLoading, hasNextPage, setSize, size]);

  // Intersection Observer untuk infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasNextPage, isLoading]);

  if (!uniqueAnime || uniqueAnime.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Tidak ada anime ditemukan</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {uniqueAnime.map((item) => (
          <Link
            key={item.slug}
            href={`/anime/${item.slug}`}
            className="group block"
          >
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

        {/* Loading skeletons inside grid */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <AnimeCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Loader trigger & end message */}
      <div ref={loaderRef} className="py-8">
        {!hasNextPage && uniqueAnime.length > 0 && (
          <p className="text-muted text-sm text-center">
            Semua anime sudah ditampilkan
          </p>
        )}
      </div>
    </>
  );
}
