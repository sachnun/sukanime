import { Suspense } from 'react';
import { getHome, getGenres, getAnimeByGenre, getAnimeDetail } from '@/lib/api';
import HeroBanner from '@/components/ui/HeroBanner';
import AnimeRow from '@/components/ui/AnimeRow';
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

  // Get some anime by popular genres
  const popularGenres = ['action', 'romance', 'comedy', 'fantasy'];
  const genreAnimePromises = popularGenres.map(async (genre) => {
    try {
      const data = await getAnimeByGenre(genre, 1);
      return { genre: data.genre, anime: data.anime.slice(0, 15) };
    } catch {
      return null;
    }
  });

  const genreAnimeResults = await Promise.all(genreAnimePromises);
  const genreAnime = genreAnimeResults.filter(Boolean);

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
        />

        {/* Complete Anime */}
        <AnimeRow
          title="Anime Tamat"
          anime={homeData.complete}
          href="/complete"
          showEpisode={false}
        />

        {/* Genre-based rows */}
        {genreAnime.map((item) => (
          item && (
            <AnimeRow
              key={item.genre}
              title={`Anime ${item.genre}`}
              anime={item.anime}
              href={`/genre/${item.genre.toLowerCase()}`}
              showEpisode={false}
            />
          )
        ))}
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
