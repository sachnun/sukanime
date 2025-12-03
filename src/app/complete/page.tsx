import { Suspense } from 'react';
import { getComplete } from '@/lib/api';
import InfiniteAnimeGrid from '@/components/ui/InfiniteAnimeGrid';
import { AnimeGridSkeleton } from '@/components/ui/Skeleton';

export const metadata = {
  title: 'Anime Complete',
  description: 'Daftar anime yang sudah tamat dengan subtitle Indonesia',
};

async function CompleteContent() {
  const data = await getComplete(1);

  return (
    <InfiniteAnimeGrid
      initialAnime={data.anime}
      initialPagination={data.pagination}
      fetchUrl="/api/complete"
      showEpisode={false}
    />
  );
}

export default function CompletePage() {
  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Anime Tamat</h1>
        <Suspense fallback={<AnimeGridSkeleton />}>
          <CompleteContent />
        </Suspense>
      </div>
    </div>
  );
}
