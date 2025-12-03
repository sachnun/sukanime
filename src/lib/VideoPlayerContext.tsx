'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface VideoState {
  streamingUrl: string;
  episodeSlug: string;
  animeSlug: string;
  animeTitle: string;
  episodeTitle: string;
}

interface VideoPlayerContextType {
  video: VideoState | null;
  isMinimized: boolean;
  minimize: (video: VideoState) => void;
  expand: () => void;
  close: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const [video, setVideo] = useState<VideoState | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const minimize = useCallback((videoState: VideoState) => {
    setVideo(videoState);
    setIsMinimized(true);
  }, []);

  const expand = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const close = useCallback(() => {
    setVideo(null);
    setIsMinimized(false);
  }, []);

  return (
    <VideoPlayerContext.Provider value={{ video, isMinimized, minimize, expand, close }}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
}
