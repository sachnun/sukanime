'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getWatchHistory } from '@/lib/storage';
import { WatchHistoryItem } from '@/types/anime';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export default function ContinueWatching() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const watchHistory = getWatchHistory();
    // Get unique anime (only show latest episode per anime)
    const uniqueAnime = watchHistory.reduce((acc, item) => {
      if (!acc.find(a => a.animeSlug === item.animeSlug)) {
        acc.push(item);
      }
      return acc;
    }, [] as WatchHistoryItem[]);
    setHistory(uniqueAnime.slice(0, 20)); // Limit to 20 items
  }, []);

  if (history.length === 0) return null;

  return (
    <section className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold">Lanjutkan Nonton</h2>
        <Link
          href="/history"
          className="flex items-center text-sm text-muted hover:text-white transition-colors"
        >
          Lihat Semua
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
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
            {history.map((item) => (
              <SwiperSlide key={item.episodeSlug}>
                <Link href={`/watch/${item.episodeSlug}`} className="block group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
                    {item.animePoster ? (
                      <Image
                        src={item.animePoster}
                        alt={item.animeTitle}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 480px) 40vw, (max-width: 640px) 30vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-card">
                        <Play className="w-12 h-12 text-muted" />
                      </div>
                    )}
                    {/* Overlay with play icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-6 h-6 fill-white text-white" />
                      </div>
                    </div>
                    {/* Episode badge */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span className="text-sm font-medium">
                        Episode {item.episodeNumber}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {item.animeTitle}
                  </h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
