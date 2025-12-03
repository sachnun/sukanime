import { Suspense } from 'react';
import { getSchedule } from '@/lib/api';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export const metadata = {
  title: 'Jadwal Rilis Anime',
  description: 'Jadwal rilis anime terbaru setiap hari',
};

async function ScheduleContent() {
  const data = await getSchedule();

  const dayColors: Record<string, string> = {
    Senin: 'border-red-500',
    Selasa: 'border-orange-500',
    Rabu: 'border-yellow-500',
    Kamis: 'border-green-500',
    Jumat: 'border-blue-500',
    Sabtu: 'border-indigo-500',
    Minggu: 'border-purple-500',
  };

  return (
    <div className="space-y-8">
      {data.schedule.map((day) => (
        <div key={day.day} className={`bg-card rounded-lg overflow-hidden border-l-4 ${dayColors[day.day] || 'border-primary'}`}>
          <div className="px-6 py-4 bg-card-hover">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {day.day}
            </h2>
          </div>
          <div className="p-4">
            {day.anime.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {day.anime.map((anime) => (
                  <Link
                    key={anime.slug}
                    href={`/anime/${anime.slug}`}
                    className="p-3 bg-secondary/30 hover:bg-secondary rounded transition-colors"
                  >
                    <span className="text-sm line-clamp-2">{anime.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">Tidak ada anime yang rilis</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Jadwal Rilis Anime</h1>
        <Suspense
          fallback={
            <div className="space-y-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden">
                  <div className="h-14 skeleton" />
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-12 rounded skeleton" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ScheduleContent />
        </Suspense>
      </div>
    </div>
  );
}
