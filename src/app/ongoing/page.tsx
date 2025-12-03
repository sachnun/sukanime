import { Suspense } from 'react';
import { getOngoing } from '@/lib/api';
import InfiniteAnimeGrid from '@/components/ui/InfiniteAnimeGrid';
import { AnimeGridSkeleton } from '@/components/ui/Skeleton';

export const metadata = {
  title: 'Anime Ongoing',
  description: 'Daftar anime yang sedang tayang dengan subtitle Indonesia',
};

async function OngoingContent() {
  const data = await getOngoing(1);

  return (
    <InfiniteAnimeGrid
      initialAnime={data.anime}
      initialPagination={data.pagination}
      fetchUrl="/api/ongoing"
      showEpisode={true}
    />
  );
}

export default function OngoingPage() {
  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Anime Sedang Tayang</h1>
        <Suspense fallback={<AnimeGridSkeleton />}>
          <OngoingContent />
        </Suspense>
      </div>
    </div>
  );
}
