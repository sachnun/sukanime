'use client';

import { useState, useEffect } from 'react';
import { StreamingServer } from '@/types/anime';
import { addToHistory } from '@/lib/storage';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface VideoPlayerProps {
  episodeSlug: string;
  animeSlug: string;
  animeTitle: string;
  animePoster: string;
  episodeTitle: string;
  streamingServers: StreamingServer[];
  defaultStreamingUrl?: string;
}

export default function VideoPlayer({
  episodeSlug,
  animeSlug,
  animeTitle,
  animePoster,
  episodeTitle,
  streamingServers,
  defaultStreamingUrl,
}: VideoPlayerProps) {
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [streamingUrl, setStreamingUrl] = useState<string>(defaultStreamingUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Helper function to extract quality number (e.g., "1080p" -> 1080)
  const getQualityNumber = (quality: string): number => {
    const match = quality.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Initialize with highest available quality
  useEffect(() => {
    if (streamingServers.length > 0) {
      // Sort by quality number descending and get the highest
      const sortedQualities = [...streamingServers].sort(
        (a, b) => getQualityNumber(b.quality) - getQualityNumber(a.quality)
      );
      const highestQuality = sortedQualities[0];
      setSelectedQuality(highestQuality.quality);

      const defaultServer = highestQuality.servers.find((s) => s.isDefault) || highestQuality.servers[0];
      if (defaultServer) {
        setSelectedServer(defaultServer.dataContent);
      }
    }
  }, [streamingServers]);

  // Add to history when component mounts
  useEffect(() => {
    // Extract episode number from title
    const episodeMatch = episodeTitle.match(/episode\s*(\d+)/i);
    const episodeNumber = episodeMatch ? episodeMatch[1] : '1';

    addToHistory({
      animeSlug,
      animeTitle,
      animePoster,
      episodeSlug,
      episodeNumber,
    });
  }, [animeSlug, animeTitle, animePoster, episodeSlug, episodeTitle]);

  // Load streaming URL when server changes
  useEffect(() => {
    if (selectedServer && !defaultStreamingUrl) {
      loadStreamingUrl(selectedServer);
    }
  }, [selectedServer, defaultStreamingUrl]);

  const loadStreamingUrl = async (dataContent: string) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/resolve-streaming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataContent }),
      });

      if (!res.ok) throw new Error('Failed to load video');

      const data = await res.json();
      setStreamingUrl(data.url);
    } catch (err) {
      setError('Gagal memuat video. Coba server lain.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    const qualityServers = streamingServers.find((s) => s.quality === quality);
    if (qualityServers && qualityServers.servers.length > 0) {
      const defaultServer =
        qualityServers.servers.find((s) => s.isDefault) || qualityServers.servers[0];
      setSelectedServer(defaultServer.dataContent);
    }
  };

  const handleServerChange = (dataContent: string) => {
    setSelectedServer(dataContent);
    loadStreamingUrl(dataContent);
  };

  const currentQualityServers = streamingServers.find((s) => s.quality === selectedQuality);

  return (
    <div className="bg-black">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => selectedServer && loadStreamingUrl(selectedServer)}
              className="px-4 py-2 bg-primary hover:bg-primary-hover rounded transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : streamingUrl ? (
          <iframe
            src={streamingUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted">Pilih server untuk memutar video</p>
          </div>
        )}
      </div>

      {/* Server Selection */}
      {streamingServers.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-card">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Quality Selection */}
            <div>
              <label className="block text-sm text-muted mb-2">Kualitas</label>
              <div className="flex flex-wrap gap-2">
                {streamingServers.map((quality) => (
                  <button
                    key={quality.quality}
                    onClick={() => handleQualityChange(quality.quality)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedQuality === quality.quality
                        ? 'bg-primary text-white'
                        : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {quality.quality}
                  </button>
                ))}
              </div>
            </div>

            {/* Server Selection */}
            {currentQualityServers && (
              <div>
                <label className="block text-sm text-muted mb-2">Server</label>
                <div className="flex flex-wrap gap-2">
                  {currentQualityServers.servers.map((server, index) => (
                    <button
                      key={`${server.provider}-${index}`}
                      onClick={() => handleServerChange(server.dataContent)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        selectedServer === server.dataContent
                          ? 'bg-primary text-white'
                          : 'bg-secondary hover:bg-muted'
                      }`}
                    >
                      {server.provider}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
