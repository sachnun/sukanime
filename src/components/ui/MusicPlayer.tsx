'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMusicPlayer } from '@/lib/MusicPlayerContext';
import { Play, Pause, X } from 'lucide-react';

export default function MusicPlayer() {
  const pathname = usePathname();
  const { currentTrack, isPlaying, toggle, stop, pause } = useMusicPlayer();
  const wasOnWatchPage = useRef(false);

  // Hide on watch pages
  const isWatchPage = pathname.startsWith('/watch');

  // Pause music when leaving watch page
  useEffect(() => {
    if (isWatchPage) {
      wasOnWatchPage.current = true;
    } else if (wasOnWatchPage.current && isPlaying) {
      // Just left watch page, pause the music
      pause();
      wasOnWatchPage.current = false;
    }
  }, [isWatchPage, isPlaying, pause]);

  // Don't render if no track or on watch page
  if (!currentTrack || isWatchPage) {
    return null;
  }

  return (
    <>
      {/* Hidden iframe for audio playback */}
      {isPlaying && (
        <iframe
          src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&loop=1&playlist=${currentTrack.videoId}`}
          allow="autoplay"
          className="w-0 h-0 absolute pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Floating player */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
        <div className="bg-card/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-3">
          <div className="flex items-center gap-3">
            {/* Play/Pause button */}
            <button
              onClick={toggle}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isPlaying
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              )}
            </button>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted truncate">
                {currentTrack.type === 'opening' ? 'Opening' : 'Ending'} • {currentTrack.animeTitle}
              </p>
              <p className="font-medium text-sm truncate">{currentTrack.title}</p>
            </div>

            {/* Close button */}
            <button
              onClick={stop}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Playing indicator */}
          {isPlaying && (
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-green-500 rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 8}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.5s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
