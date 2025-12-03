'use client';

import { useState } from 'react';
import { getBookmarks, removeBookmark } from '@/lib/storage';
import { BookmarkItem } from '@/types/anime';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2, Play } from 'lucide-react';

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    // Initialize from storage on first render (client-side only)
    if (typeof window !== 'undefined') {
      return getBookmarks();
    }
    return [];
  });
  // Use a state initializer that checks if we're on client
  const [isMounted] = useState(() => typeof window !== 'undefined');

  const handleRemove = (slug: string) => {
    removeBookmark(slug);
    setBookmarks(getBookmarks());
  };

  // Show skeleton on server-side render
  if (!isMounted) {
    return (
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Bookmark Saya</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-lg skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Bookmark Saya</h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 mx-auto text-muted mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum Ada Bookmark</h2>
            <p className="text-muted mb-6">
              Simpan anime favoritmu untuk ditonton nanti
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover rounded font-semibold transition-colors"
            >
              Jelajahi Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {bookmarks.map((item) => (
              <div key={item.slug} className="group relative">
                <Link href={`/anime/${item.slug}`} className="block">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <button
                  onClick={() => handleRemove(item.slug)}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Hapus dari bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
