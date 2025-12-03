'use client';

import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AnimeCard from './AnimeCard';
import AnimeCardSkeleton from './Skeleton';
import { AnimeCard as AnimeCardType } from '@/types/anime';
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

export default function AnimeRow({ title, anime, href, showEpisode = true, fetchUrl }: AnimeRowProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [items, setItems] = useState<AnimeCardType[]>(anime);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(!!fetchUrl);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasNextPage || !fetchUrl) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const res = await fetch(`${fetchUrl}?page=${nextPage}`);
      const json = await res.json();

      if (json.success && json.data) {
        setItems((prev) => [...prev, ...json.data.anime]);
        setCurrentPage(nextPage);
        setHasNextPage(json.data.pagination.hasNextPage);
      }
    } catch (error) {
      console.error('Failed to load more anime:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, fetchUrl, currentPage]);

  const handleSlideChange = (swiper: SwiperType) => {
    // Load more when reaching near the end (5 slides before end)
    const slidesFromEnd = swiper.slides.length - swiper.activeIndex - swiper.slidesPerViewDynamic();
    if (slidesFromEnd <= 5 && hasNextPage && !isLoading) {
      loadMore();
    }
  };

  if (!items || items.length === 0) return null;

  // Remove duplicates based on slug
  const uniqueAnime = items.filter(
    (item, index, self) => index === self.findIndex((a) => a.slug === item.slug)
  );

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
            onSwiper={() => setIsReady(true)}
            onSlideChange={fetchUrl ? handleSlideChange : undefined}
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
