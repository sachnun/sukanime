'use client';

import { useState, useEffect } from 'react';
import { getWatchHistory, clearHistory } from '@/lib/storage';
import { WatchHistoryItem } from '@/types/anime';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Trash2, Play } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHistory(getWatchHistory());
    setIsLoading(false);
  }, []);

  const handleClearHistory = () => {
    if (confirm('Apakah kamu yakin ingin menghapus semua riwayat?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} menit yang lalu`;
      }
      return `${hours} jam yang lalu`;
    } else if (days === 1) {
      return 'Kemarin';
    } else if (days < 7) {
      return `${days} hari yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Riwayat Nonton</h1>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Riwayat Nonton</h1>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-xs sm:text-sm"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Hapus Semua</span>
              <span className="sm:hidden">Hapus</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 mx-auto text-muted mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum Ada Riwayat</h2>
            <p className="text-muted mb-6">
              Anime yang kamu tonton akan muncul di sini
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover rounded font-semibold transition-colors"
            >
              Jelajahi Anime
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Link
                key={`${item.episodeSlug}-${item.watchedAt}`}
                href={`/watch/${item.episodeSlug}`}
                className="flex items-center gap-4 p-4 bg-card hover:bg-card-hover rounded-lg transition-colors group"
              >
                {/* Poster */}
                <div className="relative w-16 sm:w-20 aspect-[2/3] rounded overflow-hidden flex-shrink-0">
                  {item.animePoster ? (
                    <Image
                      src={item.animePoster}
                      alt={item.animeTitle}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Play className="w-6 h-6 text-muted" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {item.animeTitle}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    Episode {item.episodeNumber}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {formatDate(item.watchedAt)}
                  </p>
                </div>

                {/* Play Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 fill-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
