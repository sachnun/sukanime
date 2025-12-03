'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AnimeCard from './AnimeCard';
import { AnimeCard as AnimeCardType } from '@/types/anime';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface AnimeRowProps {
  title: string;
  anime: AnimeCardType[];
  href?: string;
  showEpisode?: boolean;
}

export default function AnimeRow({ title, anime, href, showEpisode = true }: AnimeRowProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!anime || anime.length === 0) return null;

  // Remove duplicates based on slug
  const uniqueAnime = anime.filter(
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

      {/* Swiper */}
      <div className="overflow-hidden">
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
          </Swiper>
        </div>
      </div>
    </section>
  );
}
