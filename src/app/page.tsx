import { Suspense } from 'react';
import { getHome, getGenres, getAnimeDetail } from '@/lib/api';
import HeroBanner from '@/components/ui/HeroBanner';
import AnimeRow from '@/components/ui/AnimeRow';
import ContinueWatching from '@/components/ui/ContinueWatching';
import LazyGenreRow from '@/components/ui/LazyGenreRow';
import InfiniteAnimeGrid from '@/components/ui/InfiniteAnimeGrid';
import { HeroBannerSkeleton, AnimeRowSkeleton } from '@/components/ui/Skeleton';
import { AnimeCard } from '@/types/anime';

export const revalidate = 300; // Revalidate every 5 minutes

async function HomeContent() {
  const [homeData, genresData] = await Promise.all([
    getHome(),
    getGenres(),
  ]);

  // Fetch latest episode slugs for hero banner (first 5 ongoing anime)
  const heroAnime = homeData.ongoing.slice(0, 5);
  const heroAnimeWithEpisodes: AnimeCard[] = await Promise.all(
    heroAnime.map(async (anime) => {
      try {
        const detail = await getAnimeDetail(anime.slug);
        const latestEpisode = detail.episodes[0];
        return {
          ...anime,
          latestEpisodeSlug: latestEpisode?.slug,
        };
      } catch {
        return anime;
      }
    })
  );

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner anime={heroAnimeWithEpisodes} />

      {/* Content */}
      <div className="-mt-20 relative z-10 pb-8">
        {/* Ongoing Anime */}
        <AnimeRow
          title="Sedang Tayang"
          anime={homeData.ongoing}
          href="/ongoing"
          fetchUrl="/api/ongoing"
        />

        {/* Continue Watching - Client Component */}
        <ContinueWatching />

        {/* Genre-based rows - Lazy loaded */}
        {genresData.genres.map((genre) => (
          <LazyGenreRow
            key={genre.slug}
            genre={genre.name}
            slug={genre.slug}
          />
        ))}

        {/* Complete Anime - Infinite Scroll */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Anime Tamat</h2>
          </div>
          <InfiniteAnimeGrid
            initialAnime={homeData.complete}
            initialPagination={{
              currentPage: 1,
              totalPages: 10,
              itemsPerPage: 24,
              hasNextPage: true,
              hasPrevPage: false,
            }}
            fetchUrl="/api/complete"
            showEpisode={false}
          />
        </section>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <>
          <HeroBannerSkeleton />
          <div className="-mt-20 relative z-10 pb-8">
            <AnimeRowSkeleton />
            <AnimeRowSkeleton />
            <AnimeRowSkeleton />
          </div>
        </>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
