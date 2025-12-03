import { Suspense } from 'react';
import { searchAnime } from '@/lib/api';
import AnimeGrid from '@/components/ui/AnimeGrid';
import { AnimeGridSkeleton } from '@/components/ui/Skeleton';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  return {
    title: query ? `Hasil pencarian "${query}"` : 'Cari Anime',
    description: `Cari anime dengan kata kunci "${query}"`,
  };
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="text-center py-20">
        <Search className="w-16 h-16 mx-auto text-muted mb-4" />
        <h2 className="text-xl font-semibold mb-2">Cari Anime Favorit Kamu</h2>
        <p className="text-muted">Masukkan judul anime yang ingin kamu cari</p>
      </div>
    );
  }

  const data = await searchAnime(query);

  if (!data.anime || data.anime.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="w-16 h-16 mx-auto text-muted mb-4" />
        <h2 className="text-xl font-semibold mb-2">Tidak Ada Hasil</h2>
        <p className="text-muted">
          Tidak ditemukan anime dengan kata kunci &quot;{query}&quot;
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-muted mb-6">
        Ditemukan {data.anime.length} hasil untuk &quot;{query}&quot;
      </p>
      <AnimeGrid anime={data.anime} showEpisode={false} />
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">
          {query ? `Hasil Pencarian: "${query}"` : 'Cari Anime'}
        </h1>
        <Suspense fallback={<AnimeGridSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}
