'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import useSWRInfinite from 'swr/infinite';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AnimeCard from './AnimeCard';
import AnimeCardSkeleton from './Skeleton';
import { AnimeCard as AnimeCardType, Pagination } from '@/types/anime';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface AnimeRowProps {
  title: string;
  anime: AnimeCardType[];
  href?: string;
  showEpisode?: boolean;
  fetchUrl?: string; // API URL for infinite loading
}

interface ApiResponse {
  success: boolean;
  data: {
    anime: AnimeCardType[];
    pagination: Pagination;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// In-memory store untuk posisi slide (mirip SWR cache)
const slidePositionCache = new Map<string, number>();

export default function AnimeRow({ title, anime, href, showEpisode = true, fetchUrl }: AnimeRowProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const cacheKey = fetchUrl || title; // Use title as fallback key

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // SWR Infinite - only used when fetchUrl is provided
  const getKey = (pageIndex: number, previousPageData: ApiResponse | null) => {
    if (!fetchUrl) return null;
    if (previousPageData && !previousPageData.data?.pagination?.hasNextPage) {
      return null;
    }
    if (pageIndex === 0) return `${fetchUrl}?page=1`;
    return `${fetchUrl}?page=${pageIndex + 1}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite<ApiResponse>(
    getKey,
    fetcher,
    {
      fallbackData: fetchUrl
        ? [
            {
              success: true,
              data: {
                anime: anime,
                pagination: {
                  currentPage: 1,
                  hasNextPage: true,
                  totalPages: 1,
                  itemsPerPage: anime.length,
                  hasPrevPage: false,
                },
              },
            },
          ]
        : undefined,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Combine items: use SWR data if fetchUrl exists, otherwise use props
  const allAnime = fetchUrl
    ? (data?.flatMap((page) => page.data?.anime ?? []) ?? anime)
    : anime;

  // Remove duplicates based on slug
  const uniqueAnime = allAnime.filter(
    (item, index, self) => index === self.findIndex((a) => a.slug === item.slug)
  );

  // Check if has next page
  const lastPage = data?.[data.length - 1];
  const hasNextPage = fetchUrl ? (lastPage?.data?.pagination?.hasNextPage ?? true) : false;
  const isLoading = isValidating;

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage && fetchUrl) {
      setSize(size + 1);
    }
  }, [isLoading, hasNextPage, fetchUrl, setSize, size]);

  const handleSlideChange = (swiper: SwiperType) => {
    // Save current position to cache
    slidePositionCache.set(cacheKey, swiper.activeIndex);
    
    if (!fetchUrl) return;
    // Load more when reaching near the end (5 slides before end)
    const slidesFromEnd = swiper.slides.length - swiper.activeIndex - swiper.slidesPerViewDynamic();
    if (slidesFromEnd <= 5 && hasNextPage && !isLoading) {
      loadMore();
    }
  };

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setIsReady(true);
    
    // Restore position from cache
    const savedPosition = slidePositionCache.get(cacheKey);
    if (savedPosition && savedPosition > 0) {
      // Use setTimeout to ensure swiper is fully initialized
      setTimeout(() => {
        swiper.slideTo(savedPosition, 0); // 0 = no animation
      }, 0);
    }
  };

  if (!uniqueAnime || uniqueAnime.length === 0) return null;

  return (
    <section className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        {href && (
          <Link
            href={href}
            className="flex items-center text-sm text-muted hover:text-white transition-colors"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {/* Skeleton while loading */}
      {!isReady && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-3 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                <AnimeCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Swiper */}
      <div className={`overflow-hidden ${!isReady ? 'hidden' : ''}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={12}
            slidesPerView={2.3}
            navigation={isDesktop}
            freeMode={{
              enabled: true,
              momentumBounce: false,
            }}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            onReachEnd={fetchUrl ? loadMore : undefined}
            breakpoints={{
              480: {
                slidesPerView: 3.3,
                spaceBetween: 14,
              },
              640: {
                slidesPerView: 4.3,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 5.3,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 6.3,
                spaceBetween: 18,
              },
              1280: {
                slidesPerView: 7.3,
                spaceBetween: 20,
              },
            }}
          >
            {uniqueAnime.map((item) => (
              <SwiperSlide key={item.slug}>
                <AnimeCard anime={item} showEpisode={showEpisode} />
              </SwiperSlide>
            ))}
            {/* Loading skeleton */}
            {isLoading && (
              <SwiperSlide>
                <AnimeCardSkeleton />
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
