'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useVideoPlayer } from '@/lib/VideoPlayerContext';
import { X, Maximize2 } from 'lucide-react';

export default function VideoMiniPlayer() {
  const pathname = usePathname();
  const router = useRouter();
  const { video, isMinimized, expand, close } = useVideoPlayer();

  // Hide on watch pages (full player is shown there)
  const isWatchPage = pathname.startsWith('/watch');

  // Don't render if no video, not minimized, or on watch page
  if (!video || !isMinimized || isWatchPage) {
    return null;
  }

  const handleExpand = () => {
    expand();
    router.push(`/watch/${video.episodeSlug}`);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 md:w-96 shadow-2xl rounded-xl overflow-hidden bg-black border border-white/10">
      {/* Video iframe */}
      <div className="relative aspect-video">
        <iframe
          src={video.streamingUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        
        {/* Overlay controls */}
        <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-2">
            <p className="text-xs text-white/80 truncate">{video.animeTitle}</p>
            <p className="text-xs text-white/60 truncate">{video.episodeTitle}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleExpand}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={close}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
