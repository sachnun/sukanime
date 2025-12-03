import { Suspense } from 'react';
import { getGenres } from '@/lib/api';
import Link from 'next/link';

export const metadata = {
  title: 'Genre Anime',
  description: 'Jelajahi anime berdasarkan genre favorit kamu',
};

async function GenreList() {
  const data = await getGenres();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {data.genres.map((genre) => (
        <Link
          key={genre.slug}
          href={`/genre/${genre.slug}`}
          className="bg-card hover:bg-card-hover rounded-lg p-6 text-center transition-all hover:scale-105"
        >
          <span className="font-medium">{genre.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default function GenrePage() {
  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Genre Anime</h1>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg skeleton" />
              ))}
            </div>
          }
        >
          <GenreList />
        </Suspense>
      </div>
    </div>
  );
}
