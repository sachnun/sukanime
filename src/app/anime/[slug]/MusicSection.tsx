'use client';

import { useState, useEffect } from 'react';
import { Music, ExternalLink, Play, Pause } from 'lucide-react';
import { useMusicPlayer } from '@/lib/MusicPlayerContext';

interface MusicSectionProps {
  title: string;
  japanese?: string;
  excludeVideoIds?: string[];
}

interface MusicData {
  opening: { videoId: string; title: string } | null;
  ending: { videoId: string; title: string } | null;
}

export default function MusicSection({ title, japanese, excludeVideoIds = [] }: MusicSectionProps) {
  const [music, setMusic] = useState<MusicData>({ opening: null, ending: null });
  const [isLoading, setIsLoading] = useState(true);
  const { currentTrack, isPlaying, play, pause } = useMusicPlayer();

  const animeTitle = title;
  const searchQuery = japanese || title;
  const openingSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${searchQuery} OP opening full`)}`;
  const endingSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${searchQuery} ED ending full`)}`;

  // Convert to string for stable dependency
  const excludeKey = excludeVideoIds.join(',');

  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoading(true);
      try {
        // Fetch opening first
        const excludeParam = excludeKey ? `&exclude=${excludeKey}` : '';
        const opRes = await fetch(`/api/trailer?q=${encodeURIComponent(`${searchQuery} OP opening full`)}${excludeParam}`);
        const opData = await opRes.json();
        
        const openingVideoId = opData.success ? opData.data.videoId : null;
        
        // Fetch ending, excluding trailer and opening
        const allExclude = [excludeKey, openingVideoId].filter(Boolean).join(',');
        const edExcludeParam = allExclude ? `&exclude=${allExclude}` : '';
        const edRes = await fetch(`/api/trailer?q=${encodeURIComponent(`${searchQuery} ED ending full`)}${edExcludeParam}`);
        const edData = await edRes.json();

        setMusic({
          opening: opData.success ? { videoId: opData.data.videoId, title: opData.data.title } : null,
          ending: edData.success ? { videoId: edData.data.videoId, title: edData.data.title } : null,
        });
      } catch (err) {
        console.error('Failed to fetch music:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusic();
  }, [searchQuery, excludeKey]);

  const handlePlay = (type: 'opening' | 'ending') => {
    const track = type === 'opening' ? music.opening : music.ending;
    if (!track) return;

    // If this track is currently playing, pause it
    if (currentTrack?.videoId === track.videoId && isPlaying) {
      pause();
    } else {
      // Play this track
      play({
        videoId: track.videoId,
        title: track.title,
        type,
        animeTitle,
      });
    }
  };

  const isTrackPlaying = (type: 'opening' | 'ending') => {
    const track = type === 'opening' ? music.opening : music.ending;
    return track && currentTrack?.videoId === track.videoId && isPlaying;
  };

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Musik</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-card rounded-lg p-4 h-[72px] skeleton" />
          <div className="bg-card rounded-lg p-4 h-[72px] skeleton" />
        </div>
      </section>
    );
  }

  if (!music.opening && !music.ending) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <Music className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Musik</h2>
      </div>

      <div className="space-y-3">
        {/* Opening */}
        {music.opening ? (
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handlePlay('opening')}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isTrackPlaying('opening')
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-primary hover:bg-primary-hover'
                  }`}
                >
                  {isTrackPlaying('opening') ? (
                    <Pause className="w-5 h-5 text-white fill-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className="text-sm text-muted">Opening</p>
                  <p className="font-medium truncate">{music.opening.title}</p>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${music.opening.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-muted hover:text-primary transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-muted" />
                </div>
                <div>
                  <p className="text-sm text-muted">Opening</p>
                  <p className="text-muted">Tidak ditemukan</p>
                </div>
              </div>
              <a
                href={openingSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Cari di YouTube
              </a>
            </div>
          </div>
        )}

        {/* Ending */}
        {music.ending ? (
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handlePlay('ending')}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isTrackPlaying('ending')
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-primary hover:bg-primary-hover'
                  }`}
                >
                  {isTrackPlaying('ending') ? (
                    <Pause className="w-5 h-5 text-white fill-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className="text-sm text-muted">Ending</p>
                  <p className="font-medium truncate">{music.ending.title}</p>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${music.ending.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-muted hover:text-primary transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-muted" />
                </div>
                <div>
                  <p className="text-sm text-muted">Ending</p>
                  <p className="text-muted">Tidak ditemukan</p>
                </div>
              </div>
              <a
                href={endingSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Cari di YouTube
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
