'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { AnimeCard } from '@/types/anime';
import { BASE_URL } from '@/lib/api';

import 'swiper/css';
import 'swiper/css/effect-fade';

interface HeroBannerProps {
  anime: AnimeCard[];
}

export default function HeroBanner({ anime }: HeroBannerProps) {
  const [heroAnime, setHeroAnime] = useState<AnimeCard[]>(anime.slice(0, 5));
  const hasFetched = useRef(false);

  // Lazy fetch episode slugs for anime that don't have them
  useEffect(() => {
    if (hasFetched.current) return;
    
    const needsFetch = heroAnime.some(item => !item.latestEpisodeSlug);
    if (!needsFetch) return;
    
    hasFetched.current = true;
    
    const fetchMissingEpisodeSlugs = async () => {
      const updated = await Promise.all(
        heroAnime.map(async (item) => {
          if (item.latestEpisodeSlug) return item;
          
          try {
            const res = await fetch(`https://otakudesu-api.dakunesu.workers.dev/api/anime/${item.slug}`);
            const json = await res.json();
            if (json.success && json.data.episodes?.[0]) {
              return {
                ...item,
                latestEpisodeSlug: json.data.episodes[0].slug,
              };
            }
          } catch {
            // Ignore errors
          }
          return item;
        })
      );
      setHeroAnime(updated);
    };
    
    fetchMissingEpisodeSlugs();
  }, [heroAnime]);

  if (!heroAnime || heroAnime.length === 0) return null;

  return (
    <section className="relative h-[55vh] sm:h-[70vh] md:h-[80vh] w-full">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="h-full w-full"
      >
        {heroAnime.map((item) => (
          <SwiperSlide key={item.slug}>
            <div className="relative h-full w-full overflow-hidden">
              {/* Background Image with Blur */}
              <Image
                src={item.poster}
                alt={item.title}
                fill
                className="object-cover scale-110 blur-sm"
                priority
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl flex gap-6 items-center">
                    {/* Small Poster (Sharp) */}
                    <div className="hidden sm:block flex-shrink-0">
                      <div className="relative w-32 md:w-40 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <Image
                          src={item.poster}
                          alt={item.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      {/* Rating */}
                      {item.rating && (
                        <div className="flex items-center space-x-2 mb-3">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">{item.rating}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 line-clamp-2">
                        {item.title}
                      </h1>

                      {/* Episode Info */}
                      <div className="flex items-center space-x-4 mb-6 text-sm text-gray-300">
                        {item.episode && (
                          <span className="bg-primary px-2 py-1 rounded text-white">
                            Episode {item.episode}
                          </span>
                        )}
                        {item.releaseDay && <span>{item.releaseDay}</span>}
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center space-x-4">
                        <Link
                          href={item.latestEpisodeSlug ? `/watch/${item.latestEpisodeSlug}` : `/anime/${item.slug}#episodes`}
                          className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
                        >
                          <Play className="w-5 h-5 fill-black" />
                          <span>Tonton</span>
                        </Link>
                        <Link
                          href={`/anime/${item.slug}`}
                          className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded font-semibold hover:bg-white/20 transition-colors"
                        >
                          <Info className="w-5 h-5" />
                          <span>Info</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
