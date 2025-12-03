'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { isBookmarked, addBookmark, removeBookmark } from '@/lib/storage';

interface BookmarkButtonProps {
  slug: string;
  title: string;
  poster: string;
}

export default function BookmarkButton({ slug, title, poster }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(slug));
  }, [slug]);

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(slug);
      setBookmarked(false);
    } else {
      addBookmark({ slug, title, poster });
      setBookmarked(true);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center gap-2 px-6 py-3 rounded font-semibold transition-colors ${
        bookmarked
          ? 'bg-white text-black hover:bg-gray-200'
          : 'bg-gray-600/70 hover:bg-gray-600'
      }`}
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="w-5 h-5" />
          Tersimpan
        </>
      ) : (
        <>
          <Bookmark className="w-5 h-5" />
          Simpan
        </>
      )}
    </button>
  );
}
