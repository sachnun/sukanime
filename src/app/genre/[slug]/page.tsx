import { Suspense } from 'react';
import { getAnimeByGenre } from '@/lib/api';
import { notFound } from 'next/navigation';
import InfiniteAnimeGrid from '@/components/ui/InfiniteAnimeGrid';
import { AnimeGridSkeleton } from '@/components/ui/Skeleton';

interface GenreDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GenreDetailPageProps) {
  const { slug } = await params;
  return {
    title: `Anime ${slug.charAt(0).toUpperCase() + slug.slice(1)} - SukAnime`,
    description: `Daftar anime genre ${slug} dengan subtitle Indonesia`,
  };
}

async function GenreAnimeContent({ slug }: { slug: string }) {
  let data;
  try {
    data = await getAnimeByGenre(slug, 1);
  } catch {
    notFound();
  }

  return (
    <InfiniteAnimeGrid
      initialAnime={data.anime}
      initialPagination={data.pagination}
      fetchUrl={`/api/genre/${slug}`}
      showEpisode={false}
    />
  );
}

export default async function GenreDetailPage({ params }: GenreDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">
          Anime {slug.charAt(0).toUpperCase() + slug.slice(1)}
        </h1>
        <Suspense fallback={<AnimeGridSkeleton />}>
          <GenreAnimeContent slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
