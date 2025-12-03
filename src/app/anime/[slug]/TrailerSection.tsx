'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface TrailerSectionProps {
  title: string;
  japanese?: string;
  onVideoIdFound?: (videoId: string) => void;
}

export default function TrailerSection({ title, japanese, onVideoIdFound }: TrailerSectionProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchQuery = japanese || title;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${searchQuery} anime PV trailer`)}`;

  const fetchTrailer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/trailer?q=${encodeURIComponent(`${searchQuery} anime PV trailer`)}`);
      const data = await response.json();

      if (data.success && data.data?.videoId) {
        setVideoId(data.data.videoId);
        onVideoIdFound?.(data.data.videoId);
      }
    } catch (err) {
      console.error('Failed to fetch trailer:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, onVideoIdFound]);

  useEffect(() => {
    fetchTrailer();
  }, [fetchTrailer]);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Trailer</h2>
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted p-4">
            <p className="mb-4">Trailer tidak ditemukan</p>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <span>Cari di YouTube</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
